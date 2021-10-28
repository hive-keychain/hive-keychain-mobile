import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {addTabFromLinking} from 'actions/index';
import {Linking} from 'react-native';
import {store} from 'store';
import isURL from 'validator/lib/isURL';
import {HASConfig} from './config';

export default async () => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      handleUrl(url);
    }
  });
  const initialUrl = await Linking.getInitialURL();
  console.log(initialUrl);
  if (initialUrl) {
    handleUrl(initialUrl);
  }
};

export const handleUrl = (url: string) => {
  if (url.startsWith(HASConfig.protocol)) {
    if (url.startsWith(HASConfig.auth_req)) {
      const buf = Buffer.from(url.replace(HASConfig.auth_req, ''), 'base64');
      const data = JSON.parse(buf.toString());
      store.dispatch(treatHASRequest(data));
    }
  } else if (isURL(url)) {
    store.dispatch(addTabFromLinking(url));
  }
};
export const clearLinkingListeners = () => {
  Linking.removeAllListeners('url');
};
