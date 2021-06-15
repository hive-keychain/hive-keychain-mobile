import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

export default ({code}) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <View style={styles.container}>
      {Array.from(Array(6)).map((e, i) => {
        const fill = i >= code.length ? 'transparent' : 'white';
        return (
          <View key={i} style={{...styles.indicator, backgroundColor: fill}} />
        );
      })}
    </View>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '50%',
      justifyContent: 'space-between',
    },
    indicator: {
      backgroundColor: 'transparent',
      width: width / 20,
      height: width / 20,
      borderRadius: width / 40,
      borderColor: 'white',
      borderWidth: 1,
    },
  });
