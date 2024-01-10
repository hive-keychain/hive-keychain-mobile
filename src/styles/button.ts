import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, RED_SHADOW_COLOR, getColors} from './colors';
import {generateBoxShadowStyle} from './shadow';
import {getFontSizeSmallDevices} from './typography';

export const BUTTON_MAX_HEIGHT = 50;
export const BUTTON_MAX_WIDTH = '80%';

export const getButtonStyle = (theme: Theme, height?: number) => {
  const getButtonHeight = (height: number) => {
    return height <= 600 ? BUTTON_MAX_HEIGHT * 0.7 : BUTTON_MAX_HEIGHT;
  };

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
          width: 20,
          height: 20,
        },
        roundedIcon: {
          borderWidth: 1,
          borderColor: getColors(theme).cardBorderColorContrast,
          borderRadius: 50,
          padding: 0,
          marginRight: 3,
        },
        biggerIcon: {
          width: 30,
          height: 30,
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
        buttonText: {fontSize: getFontSizeSmallDevices(height, 14)},
      }),
  };
};
