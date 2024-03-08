import {TextStyle, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

export const getMenuCardStyle = (theme: Theme) => {
  return {
    borderRadius: 11,
    borderWidth: 1,
    borderColor: getColors(theme).cardBorderColorContrast,
    backgroundColor: getColors(theme).cardBgLighter,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
  } as ViewStyle;
};

export const getMenuFontStyle = (theme: Theme) => {
  return {
    color: getColors(theme).secondaryText,
  } as TextStyle;
};
