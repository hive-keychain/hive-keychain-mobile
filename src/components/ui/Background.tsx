import {useHeaderHeight} from '@react-navigation/elements';
import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  KeyboardAvoidingView,
  Platform,
  ScaledSize,
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import SafeArea from './SafeArea';

const hexagonsLight = require('assets/new_UI/hexagons-bg-light.png');
const hexagonsDark = require('assets/new_UI/hexagons-bg-dark.png');

interface BackgroundProps {
  children: React.ReactNode;
  theme: Theme;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  additionalBgSvgImageStyle?: StyleProp<ImageStyle>;
  skipTop?: boolean;
  skipBottom?: boolean;
}

export default (props: BackgroundProps) => {
  const styles = getStyles(useWindowDimensions(), props.theme);
  const height = useHeaderHeight();
  const insets = useSafeAreaInsets();
  return (
    <SafeArea
      style={[styles.mainContainer]}
      skipTop={props.skipTop}
      skipBottom={props.skipBottom}>
      <KeyboardAvoidingView
        style={[styles.container, props.containerStyle]}
        enabled={Platform.OS === 'ios'}
        behavior={'padding'}
        keyboardVerticalOffset={height + insets.bottom}>
        <ImageBackground
          source={props.theme === Theme.LIGHT ? hexagonsLight : hexagonsDark}
          resizeMethod="scale"
          resizeMode="stretch"
          style={[styles.container]}
          imageStyle={[styles.bgSvgStyle, props.additionalBgSvgImageStyle]}>
          {props.children}
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeArea>
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
