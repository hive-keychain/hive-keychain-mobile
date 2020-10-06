import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {formatBalance} from 'utils/format';
import {getCurrencyProperties} from 'utils/hiveReact';

const TokenDisplay = ({currency, account}) => {
  let {color, value, logo} = getCurrencyProperties(currency, account);

  const styles = getDimensionedStyles({
    color,
    ...useWindowDimensions(),
  });
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>{logo}</View>
          <Text style={styles.name}>BALANCE</Text>
        </View>
        <Text style={styles.amount}>
          {formatBalance(value)}
          <Text style={styles.currency}>{` ${currency}`}</Text>
        </Text>
      </View>
    </View>
  );
};

const getDimensionedStyles = ({width, height, color}) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 10,
      width: '100%',
      backgroundColor: '#DCE4EA',
      paddingHorizontal: width * 0.05,
      paddingVertical: width * 0.03,
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {display: 'flex', flexDirection: 'row'},
    logo: {justifyContent: 'center', alignItems: 'center'},
    name: {
      marginLeft: width * 0.03,
      fontSize: 15,
      color: '#404950',
    },
    amount: {fontSize: 17},
    currency: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default TokenDisplay;
