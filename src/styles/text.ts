import {TextStyle, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {DARKER_RED_COLOR, NEUTRAL_WHITE_COLOR, getColors} from './colors';
import {FontPoppinsName, getFontSizeSmallDevices} from './typography';

export const getCaptionStyle = (width: number, theme: Theme) => {
  return {
    fontSize: getFontSizeSmallDevices(width, 14),
    fontFamily: FontPoppinsName.REGULAR,
    color: getColors(theme).primaryText,
    paddingHorizontal: 16,
    marginTop: 16,
  } as TextStyle;
};

export const getBadgeStyle = (width: number, theme: Theme) => {
  return {
    container: {
      borderRadius: 12,
      backgroundColor: DARKER_RED_COLOR,
      paddingHorizontal: 8,
      paddingVertical: 4,
    } as ViewStyle,
    text: {
      fontSize: getFontSizeSmallDevices(width, 10),
      fontFamily: FontPoppinsName.SEMI_BOLD,
      color: NEUTRAL_WHITE_COLOR,
      letterSpacing: 0.5,
    } as TextStyle,
  };
};
