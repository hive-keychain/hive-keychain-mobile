import React from 'react';
import {WebView} from 'react-native-webview';

export default ({data: {url, id}}) => {
  console.log(url);
  return <WebView source={{uri: url}} />;
};
