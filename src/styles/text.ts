import {TextStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';
import {FontPoppinsName, getFontSizeSmallDevices} from './typography';

export const getCaptionStyle = (width: number, theme: Theme) => {
  return {
    fontSize: getFontSizeSmallDevices(width, 14),
    fontFamily: FontPoppinsName.REGULAR,
    color: getColors(theme).primaryText,
    paddingHorizontal: 16,
    marginTop: 24,
  } as TextStyle;
};
