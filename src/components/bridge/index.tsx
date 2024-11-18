import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import html from './html';

let self: Bridge;
// https://github.com/react-native-webview/react-native-webview/issues/3368
// Before updating library
type InnerProps = {
  pendingMethods: object;
  webref: WebView;
};
class Bridge extends Component implements InnerProps {
  pendingMethods: Record<string, any> = {};
  webref: WebView;

  constructor(props: any) {
    super(props);
    // eslint-disable-next-line consistent-this
    self = this;
  }

  sendMessage(methodName: string, params: any[]) {
    const id = Math.random().toString(36).substr(2, 9); //just unique id
    const paramsJoined = params
      .map((e) => e.replace(/\\/g, '\\\\').replace(/'/g, "\\'"))

      .join("','");
    const js = `
        returnValue = window.${methodName}('${paramsJoined}');
        returnObject = JSON.stringify({id: "${id}", data: returnValue});
        window.ReactNativeWebView.postMessage(returnObject);
    `;

    this.webref.injectJavaScript(js);

    return new Promise((resolve, reject) => {
      self.pendingMethods[id] = {resolve, reject};
    });
  }

  onWebViewMessage(event: {nativeEvent: {data: string}}) {
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

export const decodeMemo = (key: string, string: string) =>
  self.sendMessage('decodeMemo', [key, string]) as Promise<string>;

export const encodeMemo = (key: string, receiverKey: string, string: string) =>
  self.sendMessage('encodeMemo', [key, receiverKey, string]) as Promise<string>;

export const signBuffer = (key: string, message: string) => {
  let buf;
  try {
    const o = JSON.parse(message, (k, v) => {
      if (
        v !== null &&
        typeof v === 'object' &&
        'type' in v &&
        v.type === 'Buffer' &&
        'data' in v &&
        Array.isArray(v.data)
      ) {
        return Buffer.from(v.data);
      }
      return v;
    });
    if (Buffer.isBuffer(o)) {
      buf = o;
    } else {
      buf = message;
    }
  } catch (e) {
    buf = message;
  }
  return self.sendMessage('signBuffer', [buf, key]) as Promise<string>;
};

export const signedCall = (
  key: string,
  method: string,
  params: string,
  username: string,
) =>
  self.sendMessage('signedCall', [method, params, username, key]) as Promise<
    string
  >;

export default Bridge;
