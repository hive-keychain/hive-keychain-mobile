import React from 'react';
import {
  ScaledSize,
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

interface BackgroundProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: JSX.Element;
  using_new_ui?: boolean;
  //TODO after refactoring remove optional
  theme?: Theme;
  additionalBgSvgImageStyle?: StyleProp<ViewStyle>;
}

export default (props: BackgroundProps) => {
  const styles = getStyles(useWindowDimensions());
  return (
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
        <ImageBgHexagonsLight
          style={[styles.bgSvgStyle, props.additionalBgSvgImageStyle]}
        />
      ) : (
        <ImageBgHexagonsDark
          style={[styles.bgSvgStyle, props.additionalBgSvgImageStyle]}
        />
      )}
      <SafeArea style={[styles.container, props.containerStyle]}>
        {props.children}
      </SafeArea>
    </View>
  );
};

const getStyles = ({width, height}: ScaledSize) =>
  StyleSheet.create({
    imageBgd: {width: '100%', height: '100%'},
    container: {flex: 1},
    imageBackground: {
      width: '100%',
      height: '100%',
    },
    bgSvgStyle: {
      position: 'absolute',
      bottom: -100,
      zIndex: -1,
      width: width * 1.2,
      alignSelf: 'center',
    },
  });
