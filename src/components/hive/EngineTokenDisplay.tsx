import {Token, TokenBalance, TokenMarket} from 'actions/interfaces';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {Send, ShowHistory} from 'components/operations/OperationsButtons';
import React, {useState} from 'react';
import {Image as Img, StyleSheet, useWindowDimensions} from 'react-native';
import Image from 'react-native-fast-image';
import {Width} from 'utils/common.types';
import TokenDisplay from './TokenDisplay';

type Props = {
  token: TokenBalance;
  tokensList: Token[];
  market: TokenMarket[];
  toggled: boolean;
  setToggle: () => void;
};
const EngineTokenDisplay = ({
  token,
  tokensList,
  market,
  toggled,
  setToggle,
}: Props) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  const [hasError, setHasError] = useState(false);
  const tokenInfo = tokensList.find((t) => t.symbol === token.symbol);
  const tokenMarket = market.find((t) => t.symbol === token.symbol);
  if (!tokenInfo) {
    return null;
  }
  const metadata = JSON.parse(tokenInfo.metadata);

  const logo = hasError ? (
    <Image
      style={styles.icon}
      source={{
        uri: Img.resolveAssetSource(HiveEngine).uri,
      }}
    />
  ) : (
    <Image
      style={styles.icon}
      source={{
        uri: metadata.icon,
      }}
      onError={() => {
        setHasError(true);
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
      toggled={toggled}
      setToggle={setToggle}
      price={{
        usd: tokenMarket ? parseFloat(tokenMarket.lastPrice) : 0,
        usd_24h_change: parseFloat(
          tokenMarket ? tokenMarket.priceChangePercent : '0',
        ),
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
