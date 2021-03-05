import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

export default ({data: {url, id}, active}) => {
  const tabRef = useRef(null);
  console.log(active, url);
  return (
    <View style={[styles.container, !active && styles.hide]}>
      <WebView
        ref={tabRef}
        source={{uri: url}}
        sharedCookiesEnabled
        javascriptEnabled
        allowsInlineMediaPlayback
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  hide: {flex: 0, opacity: 0, display: 'none', width: 0, height: 0},
});
