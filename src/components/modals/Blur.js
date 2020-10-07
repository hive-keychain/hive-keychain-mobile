import React from 'react';
import {StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';

export default ({blur, show, children}) => {
  if (show) {
    return (
      <BlurView style={styles.main} blurType="dark" blurAmount={blur || 10}>
        {children}
      </BlurView>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  main: {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0},
});
