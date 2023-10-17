import HexagonsBgSvgDark from 'assets/new_UI/background_hexagons_dark.svg';
import HexagonsBgSvgLight from 'assets/new_UI/background_hexagons_light.svg';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';

interface Props {
  theme: Theme;
  additionalSvgStyle?: StyleProp<ViewStyle>;
}

export const BackgroundHexagons = ({theme, additionalSvgStyle}: Props) => {
  const styles = getStyles(theme, useWindowDimensions().height);
  const finalStyle = [styles.bgSvgStyle, additionalSvgStyle];

  return theme === Theme.LIGHT ? (
    <HexagonsBgSvgLight style={finalStyle} />
  ) : (
    <HexagonsBgSvgDark style={finalStyle} />
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    bgSvgStyle: {
      position: 'absolute',
      bottom: -100,
      zIndex: -1,
      width: width * 1.2,
      alignSelf: 'center',
    },
  });
