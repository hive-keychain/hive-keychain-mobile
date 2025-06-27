import {TokenBalance, TokenMarket} from 'actions/interfaces';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {TokenHistoryProps} from 'components/history/hive-engine/TokensHistory';
import FastImageComponent from 'components/ui/FastImage';
import React, {useState} from 'react';
import {
  Image as Img,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Image from 'react-native-fast-image';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {RootState} from 'store';
import {Colors, getTokenBackgroundColor} from 'utils/colors';
import {Width} from 'utils/common.types';
import {formatBalance} from 'utils/format';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {navigate} from 'utils/navigation';
import TokenDisplay from './TokenDisplay';

type Props = {
  token: TokenBalance;
  tokensList: Token[];
  market: TokenMarket[];
  toggled: boolean;
  setToggle: () => void;
  addBackground?: boolean;
};
const EngineTokenDisplay = ({
  token,
  tokensList,
  market,
  toggled,
  setToggle,
  addBackground,
  hivePrice,
  colors,
}: Props & PropsFromRedux) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getDimensionedStyles(
    {width},
    theme,
    token.symbol,
    colors,
    addBackground,
  );
  const [hasError, setHasError] = useState(0);
  const tokenInfo = tokensList.find((t) => t.symbol === token.symbol);
  const tokenMarket = market.find((t) => t.symbol === token.symbol);

  if (!tokenInfo) return null;
  const getLogo = () => {
    switch (hasError) {
      case 0:
        if (!tokenInfo.metadata.icon) setHasError(2);
        return (
          <FastImageComponent
            style={styles.iconBase}
            source={tokenInfo.metadata.icon}
            onError={() => {
              setHasError(1);
            }}
          />
        );
      case 1:
        return (
          <FastImageComponent
            style={styles.iconBase}
            source={`https://images.hive.blog/0x0/${tokenInfo.metadata.icon}`}
            onError={() => {
              setHasError(2);
            }}
          />
        );
      case 2:
        return (
          <Image
            style={styles.iconBase}
            source={{
              uri: Img.resolveAssetSource(HiveEngine).uri,
            }}
            onError={() => {}}
          />
        );
      default:
        return null;
    }
  };

  const onHandleGoToTokenHistory = () => {
    navigate('TokensHistory', {
      currency: token.symbol,
      tokenBalance: token.balance,
      tokenLogo: getLogo(),
      theme: theme,
    } as TokenHistoryProps);
  };

  return (
    <View style={[getCardStyle(theme).wrapperCardItem, {zIndex: 11}]}>
      <TokenDisplay
        name={tokenInfo.name}
        currency={token.symbol}
        color="black"
        balance={parseFloat(token.balance)}
        totalValue={getHiveEngineTokenValue(token, market) * hivePrice}
        toggled={toggled}
        setToggle={setToggle}
        price={{
          usd: tokenMarket
            ? formatBalance(parseFloat(tokenMarket.lastPrice) * hivePrice)
            : tokenInfo.symbol === 'SWAP.HIVE'
            ? formatBalance(hivePrice)
            : '0',
          usd_24h_change: parseFloat(
            tokenMarket ? tokenMarket.priceChangePercent : '0',
          ),
        }}
        logo={
          <View
            style={[
              styles.iconContainerBase,
              !hasError ? styles.iconContainerBaseWithBg : undefined,
            ]}>
            {getLogo()}
          </View>
        }
        renderButtonOptions={false}
        theme={theme}
        tokenInfo={tokenInfo}
        tokenBalance={token}
        onHandleGoToTokenHistory={onHandleGoToTokenHistory}
      />
    </View>
  );
};

const getDimensionedStyles = (
  {width}: Width,
  theme: Theme,
  symbol: string,
  colors: Colors,
  addBackground?: boolean,
) =>
  StyleSheet.create({
    iconBase: {
      width: 24,
      height: 24,
    },
    iconContainerBase: {
      padding: 5,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainerBaseWithBg: {
      backgroundColor: addBackground
        ? getTokenBackgroundColor(colors, symbol, theme)
        : undefined,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    hivePrice: state.currencyPrices?.hive?.usd,
    colors: state.colors,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EngineTokenDisplay);
