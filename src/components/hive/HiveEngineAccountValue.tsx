import {CurrencyPrices, TokenBalance, TokenMarket} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {withCommas} from 'utils/format';

type Props = {
  tokensMarket: TokenMarket[];
  prices: CurrencyPrices;
  tokens: TokenBalance[];
};

const HiveEngineAccountValue = ({tokens, tokensMarket, prices}: Props) => {
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
      accountValue * prices.hive.usd + '',
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
