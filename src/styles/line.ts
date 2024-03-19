import {StyleProp, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {SECONDLINESTROKESEPARATOR, getColors} from './colors';

export const getHorizontalLineStyle = (
  theme: Theme,
  width: number,
  height: number,
  marginRight?: number,
) => {
  return {
    width: width,
    height: height,
    backgroundColor: getColors(theme).quaternaryCardBorderColor,
    marginTop: 0,
    borderWidth: 0,
    margin: 0,
    marginRight: marginRight ?? 0,
  };
};

export const getSeparatorLineStyle = (theme: Theme, height: number) => {
  return {
    itemLine: {
      height: height,
      borderColor: SECONDLINESTROKESEPARATOR,
      opacity: theme === Theme.LIGHT ? 1 : 0.7,
      marginTop: 0,
    } as StyleProp<ViewStyle>,
  };
};
