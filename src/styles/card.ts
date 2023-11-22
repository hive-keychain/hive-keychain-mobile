import {StyleProp, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

export const getCardStyle = (theme: Theme, borderRadius?: number) => {
  return {
    defaultCardItem: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: borderRadius ?? 19,
      paddingHorizontal: 21,
      paddingVertical: 15,
      marginBottom: 8,
    } as StyleProp<ViewStyle>,
    roundedCardItem: {
      borderWidth: 1,
      borderColor: getColors(theme).secondaryCardBorderColor,
      borderRadius: borderRadius ?? 26,
      padding: 4,
      backgroundColor: getColors(theme).secondaryCardBgColor,
    } as StyleProp<ViewStyle>,
    floatingBar: {
      borderRadius: 22,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      padding: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    } as StyleProp<ViewStyle>,
  };
};
