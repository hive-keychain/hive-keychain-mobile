import React from 'react';
import {ImageBackground, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import SafeArea from './SafeArea';

//TODO remove and its use
const imageBgd = require('assets/background.png');

const imageBgdHexagons = require('assets/new_UI/Frame_background_hexagons.png');

interface BackgroundProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: JSX.Element;
  using_new_ui?: boolean;
  //TODO after refactoring remove optional
  theme?: Theme;
}

export default (props: BackgroundProps) => {
  return props.using_new_ui ? (
    <ImageBackground
      {...props}
      source={imageBgdHexagons}
      style={[
        styles.imageBackground,
        props.style,
        {
          backgroundColor: getColors(props.theme).primaryBackground,
        },
      ]}
      imageStyle={styles.bgImageStyle}>
      <SafeArea style={[styles.container, props.containerStyle]}>
        {props.children}
      </SafeArea>
    </ImageBackground>
  ) : (
    <ImageBackground
      {...props}
      source={imageBgd}
      style={[styles.imageBgd, props.style]}>
      <SafeArea style={[styles.container, props.containerStyle]}>
        {props.children}
      </SafeArea>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBgd: {width: '100%', height: '100%'},
  container: {flex: 1},
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  bgImageStyle: {
    height: '40%',
    bottom: 0,
    top: undefined,
  },
});
