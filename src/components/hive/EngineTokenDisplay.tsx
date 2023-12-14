import {Token, TokenBalance, TokenMarket} from 'actions/interfaces';
import {clearTokensFilters} from 'actions/tokensFilters';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import React, {useContext, useState} from 'react';
import {
  Image as Img,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Image from 'react-native-fast-image';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import {getBackgroundColorFromBackend} from 'utils/colors';
import {Width} from 'utils/common.types';
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
  clearTokensFilters,
  addBackground,
}: Props & PropsFromRedux) => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(
    useWindowDimensions(),
    theme,
    token.symbol,
    addBackground,
  );
  const [hasError, setHasError] = useState(false);
  const tokenInfo = tokensList.find((t) => t.symbol === token.symbol);
  const tokenMarket = market.find((t) => t.symbol === token.symbol);

  if (!tokenInfo) {
    return null;
  }
  const metadata = JSON.parse(tokenInfo.metadata);

  const logo = hasError ? (
    <Image
      style={styles.iconBase}
      source={{
        uri: Img.resolveAssetSource(HiveEngine).uri,
      }}
      onError={() => {
        console.log('default');
      }}
    />
  ) : (
    <Image
      style={[styles.iconBase, styles.iconBase]}
      source={{
        uri: metadata.icon,
      }}
      onError={() => {
        setHasError(true);
      }}
    />
  );

  const onHandleGoToTokenHistory = () => {
    clearTokensFilters();
    navigate('TokensHistory', {
      currency: token.symbol,
      tokenBalance: token.balance,
      tokenLogo: logo,
      theme: theme,
    } as TokenHistoryProps);
  };

  return (
    <TokenDisplay
      name={tokenInfo.name}
      currency={token.symbol}
      color="black"
      value={parseFloat(token.balance)}
      totalValue={getHiveEngineTokenValue(token, market)}
      toggled={toggled}
      setToggle={setToggle}
      price={{
        usd: tokenMarket ? parseFloat(tokenMarket.lastPrice) : 0,
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
          {logo}
        </View>
      }
      renderButtonOptions={false}
      theme={theme}
      tokenInfo={tokenInfo}
      tokenBalance={token}
      onHandleGoToTokenHistory={onHandleGoToTokenHistory}
    />
  );
};

const getDimensionedStyles = (
  {width}: Width,
  theme: Theme,
  symbol: string,
  addBackground?: boolean,
) =>
  StyleSheet.create({
    iconBase: {
      width: width / 16,
      height: width / 16,
    },
    iconContainerBase: {
      padding: 3,
      borderRadius: 50,
    },
    iconContainerBaseWithBg: {
      backgroundColor: addBackground
        ? getBackgroundColorFromBackend(symbol)
        : undefined,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {
  clearTokensFilters,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EngineTokenDisplay);
