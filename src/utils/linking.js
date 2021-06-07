import {Linking} from 'react-native';

export default async (addTabFromLinking) => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      addTabFromLinking(url);
    }
  });
  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    addTabFromLinking(initialUrl);
  }
};

export const clearLinkingListeners = () => {
  Linking.removeAllListeners('url');
};
