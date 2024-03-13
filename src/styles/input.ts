import {StyleSheet} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  body_primary_body_1,
  getFontSizeSmallDevices,
} from './typography';

export const INPUT_HEIGHT_SMALL_DEVICES = 38;
export const INPUT_HEIGHT_BIGGER_DEVICES = 60;
export const INPUT_HEIGHT_CONTAINER_SMALL_DEVICES = 40;
export const INPUT_HEIGHT_CONTAINER_BIGGER_DEVICES = 50;

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
    },
    label: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_1}.fontSize,
      ),
    },
  });
};
