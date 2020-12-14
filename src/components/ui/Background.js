import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const imageBgd = require('assets/background.png');

export default (props) => {
  return (
    <ImageBackground
      {...props}
      source={imageBgd}
      style={[styles.imageBgd, props.style]}>
      <SafeAreaView style={[styles.container, props.containerStyle]}>
        {props.children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBgd: {width: '100%', height: '100%'},
  container: {flex: 1},
});
