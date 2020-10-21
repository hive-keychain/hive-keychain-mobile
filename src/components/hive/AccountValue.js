import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {getAccountValue} from 'utils/price';
import {withCommas} from 'utils/format';

const AccountValue = ({bittrex, account, properties}) => {
  let accountValue = 0;
  if (bittrex.btc && account && properties.globals) {
    accountValue = withCommas(
      getAccountValue(account, bittrex, properties.globals),
      2,
    );
  }
  return <Text style={styles.accountValue}>{`$ ${accountValue}`}</Text>;
};

const styles = StyleSheet.create({
  accountValue: {
    color: '#626F79',
    fontSize: 28,
    textAlign: 'center',
    width: '100%',
  },
});

export default AccountValue;
