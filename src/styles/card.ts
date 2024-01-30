import {StyleProp, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

export const CARD_PADDING_HORIZONTAL = 16;
export const CARD_SMALLEST_PADDING = 15;

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
    wrapperCardItem: {
      paddingHorizontal: 15,
      borderLeftWidth: 1,
      borderLeftColor: getColors(theme).cardBorderColor,
      borderRightWidth: 1,
      borderRightColor: getColors(theme).cardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      paddingBottom: 9,
    },
    borderTopCard: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomWidth: 0,
      backgroundColor: getColors(theme).secondaryCardBgColor,
    },
    filledWrapper: {
      height: 200,
      borderLeftColor: getColors(theme).cardBorderColor,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderRightColor: getColors(theme).cardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      bottom: 0,
      zIndex: 10,
    },
  };
};
