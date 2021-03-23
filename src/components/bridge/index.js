import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import html from './html';

let self;
class Bridge extends Component {
  constructor(props) {
    super(props);
    this.pendingMethods = {};
    // eslint-disable-next-line consistent-this
    self = this;
  }

  sendMessage(methodName, params) {
    const id = Math.random().toString(36).substr(2, 9); //just unique id
    const js = `
        returnValue = window.${methodName}("${params.join('","')}");

        returnObject = JSON.stringify({id: "${id}", data: returnValue});
        window.ReactNativeWebView.postMessage(returnObject);
    `;
    this.webref.injectJavaScript(js);

    return new Promise((resolve, reject) => {
      self.pendingMethods[id] = {resolve, reject};
    });
  }

  onWebViewMessage(event) {
    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.warn(err);
      return;
    }
    self.pendingMethods[msgData.id].resolve(msgData.data);
  }
  render() {
    return (
      <View style={styles.container}>
        <WebView
          source={{html}}
          ref={(r) => {
            this.webref = r;
          }}
          onMessage={this.onWebViewMessage}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({container: {height: 0}});

export const decodeMemo = (key, string) =>
  self.sendMessage('decodeMemo', [key, string]);

export const encodeMemo = (key, receiverKey, string) =>
  self.sendMessage('encodeMemo', [key, receiverKey, string]);

export const signBuffer = (string, key) =>
  self.sendMessage('signBuffer', [string, key]);

export const signedCall = (method, params, username, key) =>
  self.sendMessage('signedCall', [method, params, username, key]);

export default Bridge;
