import {StyleSheet, TextStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';
import {
  FontPoppinsName,
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  getFontSizeSmallDevices,
} from './typography';

export const INPUT_HEIGHT_SMALL_DEVICES = 38;
export const INPUT_HEIGHT_BIGGER_DEVICES = 60;
export const INPUT_HEIGHT_CONTAINER_SMALL_DEVICES = 30;
export const INPUT_HEIGHT_CONTAINER_BIGGER_DEVICES = 40;

export const getInputHeight = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? INPUT_HEIGHT_SMALL_DEVICES
    : INPUT_HEIGHT_BIGGER_DEVICES;
};

export const getInputContainerHeight = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? INPUT_HEIGHT_CONTAINER_SMALL_DEVICES
    : INPUT_HEIGHT_CONTAINER_BIGGER_DEVICES;
};

export const inputStyle = (theme: Theme, width: number) => {
  return StyleSheet.create({
    input: {
      fontSize: getFontSizeSmallDevices(width, 16),
      color: getColors(theme).secondaryText,
    } as TextStyle,
    label: {
      fontFamily: FontPoppinsName.SEMI_BOLD,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 15),
      marginBottom: 3,
      fontWeight: '600',
    },
  });
};
