import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from './colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  getFontSizeSmallDevices,
} from './typography';

export const BUTTON_MAX_HEIGHT = 50;
export const BUTTON_MAX_WIDTH = '80%';
export const BUTTON_MARGIN_BETWEEN = 3;
export const BUTTON_ICON_SMALL_WIDTH_HEIGHT = 20;
export const BUTTON_ICON_BIG_WIDTH_HEIGHT = 30;
export const BUTTON_ICON_TEXT_MARGIN = 8;
export const MAIN_PAGE_ACTION_BUTTONS_WIDTH = '43%';

export const getButtonHeight = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? BUTTON_MAX_HEIGHT * 0.75
    : BUTTON_MAX_HEIGHT;
};

export const getButtonIconDimension = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? BUTTON_ICON_SMALL_WIDTH_HEIGHT
    : BUTTON_ICON_BIG_WIDTH_HEIGHT;
};

export const getButtonStyle = (theme: Theme, screenWidth?: number) => {
  return {
    outline: {
      borderColor: getColors(theme).borderContrast,
      borderWidth: 1,
    } as StyleProp<ViewStyle>,
    outlineSoftBorder: {
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
    } as StyleProp<ViewStyle>,
    warningStyleButton: [
      {
        backgroundColor: PRIMARY_RED_COLOR,
        color: getColors(theme).secondaryTextInverted,
        height: screenWidth ? getButtonHeight(screenWidth) : BUTTON_MAX_HEIGHT,
      },
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
          width: MAIN_PAGE_ACTION_BUTTONS_WIDTH,
          height: 70,
          paddingVertical: 0,
          paddingHorizontal: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        buttonText: {
          fontSize: getFontSizeSmallDevices(screenWidth, 15),
        },
      }),
  };
};
