import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

const imageBgd = require('../assets/background.png');

export default (props) => {
  return (
    <ImageBackground
      {...props}
      source={imageBgd}
      style={{...styles.imageBgd, ...props.style}}>
      {props.children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBgd: {width: '100%', height: '100%'},
});
