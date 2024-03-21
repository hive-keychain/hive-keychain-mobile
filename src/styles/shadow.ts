import {Platform, StyleProp, ViewStyle} from 'react-native';

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

export const getButtonBoxShadow = (color: string) => {
  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  } as StyleProp<ViewStyle>;

  // if (Platform.OS === 'ios') {
  //   return {};
  // } else if (Platform.OS === 'android') {
  //   return {
  //     elevation: 6,
  //     shadowColor: shadowColor,
  //   } as StyleProp<ViewStyle>;
  // }
};
