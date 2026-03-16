import {Tab} from 'actions/interfaces';
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

const captureTab = (
  view: MutableRefObject<WebView> | MutableRefObject<View | ScrollView>,
) => {
  const capture = captureRef(view.current, {
    format: 'jpg',
    quality: 0.2,
  });
  return capture;
};

const findTabById = (tabs: Tab[], id: number) => {
  return tabs.find((tab) => tab.id === id);
};

export const BrowserUtils = {
  captureTab,
  findTabById,
};
