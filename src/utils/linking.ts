import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {addTabFromLinking} from 'actions/index';
import {Linking} from 'react-native';
import {store} from 'store';
import isURL from 'validator/lib/isURL';
import {HASConfig} from './config';
import {processQRCodeOp} from './hive-uri';
import {goBack} from './navigation';
/* istanbul ignore next */
export default async () => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      handleUrl(url);
    }
  });

  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    handleUrl(initialUrl);
  }
};

export const handleUrl = (url: string, qr: boolean = false) => {
  if (url.startsWith(HASConfig.protocol)) {
    if (url.startsWith(HASConfig.auth_req)) {
      const buf = Buffer.from(url.replace(HASConfig.auth_req, ''), 'base64');
      const data = JSON.parse(buf.toString());
      if (qr) {
        goBack();
      }
      store.dispatch(treatHASRequest(data));
    }
  } else if (url.startsWith('hive://')) {
    if (qr) {
      goBack();
    }
    if (url.startsWith('hive://sign/op/')) {
      const op = url.replace('hive://sign/op/', '');
      const stringOp = Buffer.from(op, 'base64').toString();
      const opJson = JSON.parse(stringOp);
      processQRCodeOp(opJson);
    }
  } else if (isURL(url)) {
    if (qr) {
      goBack();
    }
    //@ts-ignore
    store.dispatch(addTabFromLinking(url));
  }
};
/* istanbul ignore next */
export const clearLinkingListeners = () => {
  Linking.removeAllListeners('url');
};
