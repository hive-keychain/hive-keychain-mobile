import React from 'react';
import {
  ImageBackground,
  ScaledSize,
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import SafeArea from './SafeArea';

const hexagonsLight = require('assets/new_UI/hexagons-bg-light.png');
const hexagonsDark = require('assets/new_UI/hexagons-bg-dark.png');

interface BackgroundProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: JSX.Element;
  using_new_ui?: boolean;
  //TODO after refactoring remove optional
  theme?: Theme;
  additionalBgSvgImageStyle?: StyleProp<ViewStyle>;
  testingFetch?: string;
}

export default (props: BackgroundProps) => {
  const styles = getStyles(useWindowDimensions(), props.theme);

  return (
    <ImageBackground
      source={props.theme === Theme.LIGHT ? hexagonsLight : hexagonsDark}
      resizeMethod="scale"
      resizeMode="stretch"
      style={[styles.container]}
      imageStyle={styles.bgSvgStyle}>
      <SafeArea style={[styles.container, props.containerStyle]}>
        {props.children}
      </SafeArea>
    </ImageBackground>
  );
};

const getStyles = ({width, height}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    imageBgd: {width: '100%', height: '100%'},
    container: {
      flex: 1,
      backgroundColor: getColors(theme).primaryBackground,
      zIndex: -2,
    },
    imageBackground: {
      width: '100%',
      height: '100%',
    },
    bgSvgStyle: {
      position: 'absolute',
      top: undefined,
      bottom: 0,
      width: width,
      height: width * 0.6,
      alignSelf: 'center',
    },
  });
