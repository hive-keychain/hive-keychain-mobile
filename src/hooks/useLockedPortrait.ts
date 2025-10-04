import {NavigationProp} from '@react-navigation/core';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';

export default (navigation: NavigationProp<any>) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener?.('focus', () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
      Orientation.removeAllListeners();
    });

    return unsubscribe;
  }, [navigation]);
};
