import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, RED_SHADOW_COLOR, getColors} from './colors';
import {generateBoxShadowStyle} from './shadow';
import {
  SMALLEST_SCREEN_HEIGHT_SUPPORTED,
  getFontSizeSmallDevices,
} from './typography';

export const BUTTON_MAX_HEIGHT = 50;
export const BUTTON_MAX_WIDTH = '80%';
export const BUTTON_MARGIN_BETWEEN = 3;
export const BUTTON_ICON_SMALL_WIDTH_HEIGHT = 20;
export const BUTTON_ICON_BIG_WIDTH_HEIGHT = 30;
export const BUTTON_ICON_TEXT_MARGIN = 8;

export const getButtonHeight = (height: number) => {
  return height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED
    ? BUTTON_MAX_HEIGHT * 0.75
    : BUTTON_MAX_HEIGHT;
};

export const getButtonIconDimension = (height: number) => {
  return height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED
    ? BUTTON_ICON_SMALL_WIDTH_HEIGHT
    : BUTTON_ICON_BIG_WIDTH_HEIGHT;
};

export const getButtonStyle = (theme: Theme, height?: number) => {
  return {
    outline: {
      borderColor: getColors(theme).borderContrast,
    } as StyleProp<ViewStyle>,
    warningStyleButton: [
      {
        backgroundColor: PRIMARY_RED_COLOR,
        height: height ? getButtonHeight(height) : BUTTON_MAX_HEIGHT,
      },
      generateBoxShadowStyle(
        0,
        13,
        RED_SHADOW_COLOR,
        1,
        25,
        30,
        RED_SHADOW_COLOR,
      ),
    ],
    secondaryButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorJustDark,
    } as StyleProp<ViewStyle>,
    getOperationButtonStylesheet: () =>
      StyleSheet.create({
        icon: {
          width: BUTTON_ICON_SMALL_WIDTH_HEIGHT,
          height: BUTTON_ICON_SMALL_WIDTH_HEIGHT,
          color: PRIMARY_RED_COLOR,
        },
        buttonMarginRight: {
          marginRight: BUTTON_ICON_TEXT_MARGIN,
        },
        biggerIcon: {
          width: BUTTON_ICON_BIG_WIDTH_HEIGHT,
          height: BUTTON_ICON_BIG_WIDTH_HEIGHT,
        },
        marginRight: {marginRight: 4},
        buttonContainer: {
          width: '40%',
          height: 70,
          paddingVertical: 0,
          paddingHorizontal: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        buttonText: {
          fontSize: getFontSizeSmallDevices(height, 14),
          marginBottom: 4,
        },
      }),
  };
};
