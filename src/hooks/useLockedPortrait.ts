import {NavigationProp} from '@react-navigation/core';
import {useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';

export default (navigation: NavigationProp<any>) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener?.('focus', () => {
      Orientation.lockToPortrait();
      Orientation.removeAllListeners();
    });

    return unsubscribe;
  }, [navigation]);
};
