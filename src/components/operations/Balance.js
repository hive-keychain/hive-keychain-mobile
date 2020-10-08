import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {formatBalance, toHP} from 'utils/format';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';

const TokenDisplay = ({currency, account, pd, globalProperties}) => {
  let {color, value, logo} = getCurrencyProperties(currency, account);
  if (pd) {
    console.log(value);
    value = parseFloat(value) - parseFloat(account.delegated_vesting_shares);
    console.log(value);
    value = toHP(value, globalProperties);
  }
  const styles = getDimensionedStyles({
    color,
    ...useWindowDimensions(),
  });
  console.log(currency, account);
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>{logo}</View>
          <Text style={styles.name}>
            {(pd
              ? translate('common.available')
              : translate('common.balance')
            ).toUpperCase()}
          </Text>
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
