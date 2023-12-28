import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  ScaledSize,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import SafeArea from './SafeArea';

const hexagonsLight = require('assets/new_UI/hexagons-bg-light.png');
const hexagonsDark = require('assets/new_UI/hexagons-bg-dark.png');

interface BackgroundProps {
  children: JSX.Element;
  theme: Theme;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  additionalBgSvgImageStyle?: StyleProp<ImageStyle>;
}

export default (props: BackgroundProps) => {
  const styles = getStyles(useWindowDimensions(), props.theme);

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={props.theme === Theme.LIGHT ? hexagonsLight : hexagonsDark}
        resizeMethod="scale"
        resizeMode="stretch"
        style={[styles.container]}
        imageStyle={[styles.bgSvgStyle, props.additionalBgSvgImageStyle]}>
        <SafeArea style={[styles.container, {zIndex: 1}, props.containerStyle]}>
          {props.children}
        </SafeArea>
      </ImageBackground>
    </View>
  );
};

const getStyles = ({width, height}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: getColors(theme).primaryBackground,
    },
    container: {
      flex: 1,
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
