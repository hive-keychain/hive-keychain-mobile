import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {Linking} from 'react-native';
import {store} from 'store';
import {HASConfig} from './config';

export default async (addTabFromLinking: (arg0: string) => void) => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      handleUrl(addTabFromLinking, url);
    }
  });
  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    handleUrl(addTabFromLinking, initialUrl);
  }
};

const handleUrl = (addTabFromLinking: (arg0: string) => void, url: string) => {
  if (url.startsWith(HASConfig.protocol)) {
    if (url.startsWith(HASConfig.auth_req)) {
      const buf = Buffer.from(url.replace(HASConfig.auth_req, ''), 'base64');
      const data = JSON.parse(buf.toString());
      store.dispatch(treatHASRequest(data));
    }
  } else {
    addTabFromLinking(url);
  }
};
export const clearLinkingListeners = () => {
  Linking.removeAllListeners('url');
};
