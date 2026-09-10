import {Tab} from 'actions/interfaces';
import * as FileSystem from 'expo-file-system/legacy';
import {MutableRefObject} from 'react';
import {ScrollView, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import WebView from 'react-native-webview';
import URLParse from 'url-parse';

const ABOUT_BLANK_URL = 'about:blank';
const ALLOWED_BROWSER_PROTOCOLS = ['https:', 'http:'] as const;
const WEB_URL_PROTOCOL_REGEX = /^https?:\/\//i;

export const urlTransformer = (url: string) => {
  const isHttps = url && url.toLowerCase().substr(0, 6) === 'https:';
  const urlObj = new URLParse(url);
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  const pathname = urlObj.pathname === '/' ? '' : urlObj.pathname;
  return {...urlObj, hostname, isHttps, pathname};
};

export const getAllowedBrowserNavigationUrl = (url?: string | null) => {
  if (typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return null;
  }

  if (trimmedUrl.toLowerCase() === ABOUT_BLANK_URL) {
    return {
      url: ABOUT_BLANK_URL,
      protocol: 'about:' as const,
    };
  }

  if (!WEB_URL_PROTOCOL_REGEX.test(trimmedUrl)) {
    return null;
  }

  try {
    const parsedUrl = new URLParse(trimmedUrl);
    const protocol = parsedUrl.protocol.toLowerCase();
    if (
      !ALLOWED_BROWSER_PROTOCOLS.includes(
        protocol as (typeof ALLOWED_BROWSER_PROTOCOLS)[number],
      ) ||
      !parsedUrl.hostname
    ) {
      return null;
    }

    return {
      url: trimmedUrl,
      protocol,
    };
  } catch (error) {
    return null;
  }
};

export const isInsecureBrowserUrl = (url?: string | null) =>
  getAllowedBrowserNavigationUrl(url)?.protocol === 'http:';

// Relative keys survive iOS sandbox UUID changes; view-shot tmp files do not.
const TAB_PREVIEW_DIR = 'tab-previews';

const getTabPreviewRelativePath = (tabId: number) =>
  `${TAB_PREVIEW_DIR}/${tabId}.jpg`;

const getTabPreviewDirectoryUri = () =>
  `${FileSystem.documentDirectory}${TAB_PREVIEW_DIR}`;

const getTabPreviewFileUri = (tabId: number) =>
  `${FileSystem.documentDirectory}${getTabPreviewRelativePath(tabId)}`;

const ensureTabPreviewDirectory = async () => {
  const directoryUri = getTabPreviewDirectoryUri();
  const info = await FileSystem.getInfoAsync(directoryUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, {intermediates: true});
  }
};

const persistTabPreview = async (tabId: number, tmpUri: string) => {
  await ensureTabPreviewDirectory();
  const destinationUri = getTabPreviewFileUri(tabId);
  await FileSystem.deleteAsync(destinationUri, {idempotent: true});
  await FileSystem.copyAsync({from: tmpUri, to: destinationUri});
  return getTabPreviewRelativePath(tabId);
};

const captureTab = async (
  view: MutableRefObject<WebView> | MutableRefObject<View | ScrollView>,
  tabId: number,
) => {
  const tmpUri = await captureRef(view.current, {
    format: 'jpg',
    quality: 0.2,
  });
  return persistTabPreview(tabId, tmpUri);
};

const resolveTabPreviewUri = (image?: string) => {
  if (!image?.startsWith(`${TAB_PREVIEW_DIR}/`)) {
    return undefined;
  }
  return `${FileSystem.documentDirectory}${image}`;
};

const deleteTabPreview = async (tabId: number) => {
  await FileSystem.deleteAsync(getTabPreviewFileUri(tabId), {
    idempotent: true,
  });
};

const deleteAllTabPreviews = async () => {
  await FileSystem.deleteAsync(getTabPreviewDirectoryUri(), {
    idempotent: true,
  });
};

const findTabById = (tabs: Tab[], id: number) => {
  return tabs.find((tab) => tab.id === id);
};

export const BrowserUtils = {
  captureTab,
  resolveTabPreviewUri,
  deleteTabPreview,
  deleteAllTabPreviews,
  findTabById,
};
