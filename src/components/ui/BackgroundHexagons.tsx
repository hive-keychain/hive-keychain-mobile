import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';

const hexagonsLight = require('assets/new_UI/hexagons-bg-light.png');
const hexagonsDark = require('assets/new_UI/hexagons-bg-dark.png');

interface Props {
  theme: Theme;
  additionalSvgStyle?: StyleProp<ImageStyle>;
}

export const BackgroundHexagons = ({theme, additionalSvgStyle}: Props) => {
  const styles = getStyles(theme, useWindowDimensions().height);
  return (
    <ImageBackground
      source={theme === Theme.LIGHT ? hexagonsLight : hexagonsDark}
      style={{flex: 1, position: 'absolute'}}
      resizeMethod="scale"
      resizeMode="stretch"
      imageStyle={[styles.bgSvgStyle, additionalSvgStyle]}
    />
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    bgSvgStyle: {
      position: 'absolute',
      top: -50,
      bottom: undefined,
      width: '100%',
      height: width / 3,
      alignSelf: 'center',
    },
  });
