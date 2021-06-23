import {token, tokenBalance, tokenMarket} from 'actions/interfaces';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {Send, ShowHistory} from 'components/operations/OperationsButtons';
import React from 'react';
import {Image as Img, StyleSheet, useWindowDimensions} from 'react-native';
import Image from 'react-native-fast-image';
import {Width} from 'utils/common.types';
import {withCommas} from 'utils/format';
import TokenDisplay from './TokenDisplay';

type Props = {
  token: tokenBalance;
  tokensList: token[];
  market: tokenMarket[];
};
const EngineTokenDisplay = ({token, tokensList, market}: Props) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  const tokenInfo = tokensList.find((t) => t.symbol === token.symbol);
  const tokenMarket = market.find((t) => t.symbol === token.symbol);
  if (!tokenInfo) {
    return null;
  }
  const metadata = JSON.parse(tokenInfo.metadata);
  const logo = (
    <Image
      style={styles.icon}
      source={{
        uri: metadata.icon || Img.resolveAssetSource(HiveEngine).uri,
      }}
    />
  );
  return (
    <TokenDisplay
      name={tokenInfo.name}
      currency={token.symbol}
      color="black"
      amountStyle={styles.amount}
      value={parseFloat(token.balance)}
      price={{
        Usd: withCommas(tokenMarket ? tokenMarket.lastPrice : '0'),
        DailyUsd:
          parseFloat(tokenMarket ? tokenMarket.priceChangePercent : '0') + '',
      }}
      buttons={[
        <Send
          key="send_token"
          currency={token.symbol}
          engine
          tokenBalance={token.balance}
          tokenLogo={logo}
        />,
        <ShowHistory
          key="history_token"
          currency={token.symbol}
          tokenBalance={token.balance}
          tokenLogo={logo}
        />,
      ]}
      logo={logo}
    />
  );
};
const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    icon: {width: width / 15, height: width / 15},
    amount: {fontWeight: 'bold', fontSize: 15},
  });

export default EngineTokenDisplay;
