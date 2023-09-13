import React from 'react';
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import SafeArea from './SafeArea';

const imageBgd = require('assets/background.png');

interface BackgroundProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: JSX.Element;
  using_new_ui?: boolean;
}

export default (props: BackgroundProps) => {
  return props.using_new_ui ? (
    <View
      {...props}
      style={[
        styles.imageBgd,
        props.style,
        {
          backgroundColor: '#E5EDF5',
        },
      ]}>
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
});
