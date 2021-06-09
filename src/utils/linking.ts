import {Linking} from 'react-native';

export default async (addTabFromLinking: (arg0: string) => void) => {
  Linking.addEventListener('url', ({url}: {string}) => {
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
