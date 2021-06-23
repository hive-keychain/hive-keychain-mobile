import React from 'react';
import {StyleSheet, View} from 'react-native';

export default ({progress}: {progress: number}) => {
  const styles = getStyles(progress);
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
    </View>
  );
};

const getStyles = (progress: number) =>
  StyleSheet.create({
    container: {width: '100%', height: progress ? 2 : 0},
    bar: {height: '100%', backgroundColor: 'red', width: `${progress * 100}%`},
  });
