import React from 'react';
import {View, StyleSheet} from 'react-native';

export default ({progress}) => {
  const styles = getStyles(progress);
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
    </View>
  );
};

const getStyles = (progress) =>
  StyleSheet.create({
    container: {width: '100%', height: progress ? 2 : 0},
    bar: {height: '100%', backgroundColor: 'red', width: `${progress * 100}%`},
  });
