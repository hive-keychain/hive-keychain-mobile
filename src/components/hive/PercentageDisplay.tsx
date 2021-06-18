import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Width} from 'utils/common.types';

type Props = {
  color: string;
  percent: number;
  name: string;
  secondary?: string;
};
const PercentageDisplay = ({color, percent, name, secondary}: Props) => {
  const styles = getDimensionedStyles({
    color,
    percent,
    ...useWindowDimensions(),
  });

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <Text style={styles.percent}>{`${percent.toFixed(0)} %`}</Text>
        <Text style={styles.secondary}>{secondary}</Text>
      </View>
      <View style={styles.greyBar}>
        <View style={styles.filler} />
      </View>
    </View>
  );
};

const getDimensionedStyles = ({
  width,
  color,
  percent,
}: Width & {color: string; percent: number}) =>
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
