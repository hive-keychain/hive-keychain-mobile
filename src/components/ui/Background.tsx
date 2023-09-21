import React from 'react';
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import ImageBgHexagonsDark from 'src/assets/new_UI/background_hexagons_dark.svg';
import ImageBgHexagonsLight from 'src/assets/new_UI/background_hexagons_light.svg';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import SafeArea from './SafeArea';

//TODO after refactoring remove and its use
const imageBgd = require('assets/background.png');

interface BackgroundProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: JSX.Element;
  using_new_ui?: boolean;
  //TODO after refactoring remove optional
  theme?: Theme;
}

export default (props: BackgroundProps) => {
  const imageBgProps = {
    style: styles.bgSvgStyle,
    width: useWindowDimensions().width,
    height: useWindowDimensions().height / 2,
  };
  return props.using_new_ui ? (
    <View
      {...props}
      style={[
        styles.imageBackground,
        props.style,
        {
          backgroundColor: getColors(props.theme).primaryBackground,
        },
      ]}>
      {props.theme === Theme.LIGHT ? (
        <ImageBgHexagonsLight {...imageBgProps} />
      ) : (
        <ImageBgHexagonsDark {...imageBgProps} />
      )}
      <SafeArea style={[styles.container, props.containerStyle]}>
        {props.children}
      </SafeArea>
    </View>
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
  bgSvgStyle: {
    position: 'absolute',
    bottom: -100,
    left: 0,
    top: undefined,
    zIndex: -1,
  },
});
