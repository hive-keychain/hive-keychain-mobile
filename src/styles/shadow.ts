import {Platform} from 'react-native';

/**
 * Note: will return equivalent shadow depending on OS
 */
export const generateBoxShadowStyle = (
  xOffset: number,
  yOffset: number,
  shadowColorIos: string,
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number,
  shadowColorAndroid: string,
  zIndex?: number,
) => {
  //TODO important need testing in IOS
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
      zIndex,
    };
  } else if (Platform.OS === 'android') {
    return {
      elevation,
      shadowColor: shadowColorAndroid,
      zIndex,
    };
  }
};
