import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {BackHandler} from 'react-native';
import {resetStackAndNavigate} from 'utils/navigation.utils';

/**
 * @description Use this hook when using the template stack or when need to goBack to an specific route(i.e: reseting nav stack) after a press on android back phone
 * Note: it may need testing on IOS.
 */
export const useBackButtonNavigation = (
  routeScreenName: string,
  skipNavigation?: boolean,
) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!skipNavigation) resetStackAndNavigate(routeScreenName);
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
