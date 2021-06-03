import {Linking} from 'react-native';

export default async (addTabIfNew) => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      addTabIfNew(url);
    }
  });
  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    console.log('from initial', initialUrl);
    addTabIfNew(initialUrl);
  }
};

export const clearLinkingListeners = () => {
  Linking.removeAllListeners('url');
};
