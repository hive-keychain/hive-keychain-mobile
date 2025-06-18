import {NavigationProp} from '@react-navigation/core';
import React from 'react';
import Orientation from 'react-native-orientation-locker';

export default (navigation: NavigationProp<any>) => {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener?.('focus', () => {
      Orientation.lockToPortrait();
      Orientation.removeAllListeners();
    });

    return unsubscribe;
  }, [navigation]);
};
