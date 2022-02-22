import {ExtendedAccount} from '@hiveio/dhive';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {withCommas} from 'utils/format';
import {getAccountValue} from 'utils/price';

type Props = {
  prices: CurrencyPrices;
  account: ExtendedAccount;
  properties: GlobalProperties;
};
const AccountValue = ({prices, account, properties}: Props) => {
  let accountValue = '...';
  if (prices.bitcoin && account && properties.globals) {
    accountValue = getAccountValue(account, prices, properties.globals) + '';
    accountValue = isNaN(+accountValue)
      ? '...'
      : `$ ${withCommas(accountValue, 2)}`;
  }
  return <Text style={styles.accountValue}>{accountValue}</Text>;
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
