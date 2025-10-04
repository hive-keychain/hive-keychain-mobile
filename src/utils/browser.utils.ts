import {Tab} from 'actions/interfaces';
import {MutableRefObject} from 'react';
import {ScrollView, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import WebView from 'react-native-webview';
import URL from 'url-parse';

export const urlTransformer = (url: string) => {
  const isHttps = url && url.toLowerCase().substr(0, 6) === 'https:';
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  const pathname = urlObj.pathname === '/' ? '' : urlObj.pathname;
  return {...urlObj, hostname, isHttps, pathname};
};

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
