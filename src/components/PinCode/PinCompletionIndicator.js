import React from 'react';
import {StyleSheet, View} from 'react-native';

export default ({code}) => {
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  indicator: {
    backgroundColor: 'transparent',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
});
