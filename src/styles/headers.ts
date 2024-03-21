import {StyleProp, TextStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Dimensions} from 'utils/common.types';
import {getColors} from './colors';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from './typography';

export const HEADER_ICON_PADDING = 16;
export const HEADER_ICON_MARGIN = 16;

export const getHeaderTitleStyle = (
  theme: Theme,
  screenWidth: Dimensions['width'],
) => {
  return {
    ...headlines_primary_headline_2,
    color: getColors(theme).primaryText,
    fontSize: getFontSizeSmallDevices(screenWidth, 20),
    textAlignVertical: 'center',
    includeFontPadding: false,
  } as StyleProp<TextStyle>;
};
