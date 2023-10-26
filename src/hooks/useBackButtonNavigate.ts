import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {BackHandler} from 'react-native';
import {resetStackAndNavigate} from 'utils/navigation';

/**
 * Note: it may need testing on IOS.
 */
export const useBackButtonNavigation = (routeScreenName: string) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Back has been pressed!');
        resetStackAndNavigate(routeScreenName);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );
};
