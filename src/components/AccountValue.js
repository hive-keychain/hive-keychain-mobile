import React from 'react';
import {Text} from 'react-native';
import {getAccountValue} from 'utils/price';
import {withCommas} from 'utils/format';

const AccountValue = ({style, bittrex, account, properties}) => {
  let accountValue = 0;
  if (bittrex.btc && account && properties.globals) {
    accountValue = withCommas(
      getAccountValue(account, bittrex, properties.globals),
      2,
    );
  }
  return <Text style={style}>{`$ ${accountValue}`}</Text>;
};

export default AccountValue;
