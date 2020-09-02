import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';

const PercentageDisplay = ({color, percent, name, secondary}) => {
  const styles = getDimensionedStyles({
    color,
    percent,
    ...useWindowDimensions(),
  });

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <Text style={styles.percent}>{` ${percent}%`}</Text>
        <Text style={styles.secondary}>{secondary}</Text>
      </View>
      <View style={styles.greyBar}>
        <View style={styles.filler} />
      </View>
    </View>
  );
};

const getDimensionedStyles = ({width, height, color, percent}) =>
  StyleSheet.create({
    textWrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      marginBottom: 10,
    },
    name: {
      color: '#7E8C9A',
      fontSize: 14,
    },
    percent: {color: 'black', fontWeight: 'bold'},
    secondary: {
      color: color,
      fontWeight: 'bold',
      textAlign: 'right',
      flex: 1,
      width: '100%',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: 0.42 * width,
    },
    greyBar: {
      height: 2,
      width: 0.42 * width,
      backgroundColor: '#D7E9F8',
    },
    filler: {
      height: 2,
      width: (width * 0.42 * percent) / 100,
      backgroundColor: color,
    },
  });

export default PercentageDisplay;
