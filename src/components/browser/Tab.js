import React from 'react';
import {WebView} from 'react-native-webview';

export default ({data: {url, id}}) => {
  return <WebView source={{uri: url}} />;
};
