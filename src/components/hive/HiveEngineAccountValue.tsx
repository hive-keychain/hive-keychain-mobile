import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {withCommas} from 'utils/format';

const HiveEngineAccountValue = ({tokens, tokensMarket, bittrex}) => {
  let accountValue = 0;
  if (tokensMarket.length) {
    for (const token of tokens) {
      const {balance, symbol} = token;
      const market = tokensMarket.find((e) => e.symbol === symbol);
      if (market) {
        accountValue += parseFloat(balance) * parseFloat(market.lastPrice);
      }
    }
  }
  return (
    <Text style={styles.accountValue}>{`$ ${withCommas(
      accountValue * parseFloat(bittrex.hive.Usd),
    )}`}</Text>
  );
};

const styles = StyleSheet.create({
  accountValue: {
    color: '#626F79',
    fontSize: 28,
    textAlign: 'center',
    width: '100%',
  },
});

export default HiveEngineAccountValue;
