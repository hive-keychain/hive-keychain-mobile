import {Token, TokenBalance, TokenMarket} from 'actions/interfaces';
import {clearTokensFilters} from 'actions/tokensFilters';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import React, {useContext, useState} from 'react';
import {Image as Img, StyleSheet, useWindowDimensions} from 'react-native';
import Image from 'react-native-fast-image';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {RootState} from 'store';
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
  //TODO bellow change to fix after refactoring
  using_new_ui?: boolean;
};
const EngineTokenDisplay = ({
  token,
  tokensList,
  market,
  toggled,
  setToggle,
  using_new_ui,
  clearTokensFilters,
}: Props & PropsFromRedux) => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
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
      onError={() => {
        console.log('default');
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
      amountStyle={styles.amount}
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
      logo={logo}
      using_new_ui={using_new_ui}
      renderButtonOptions={false}
      theme={theme}
      tokenInfo={tokenInfo}
      tokenBalance={token}
      onHandleGoToTokenHistory={onHandleGoToTokenHistory}
    />
  );
};

const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  //TODO bellow removed unused styles after refactoring
  StyleSheet.create({
    icon: {width: width / 15, height: width / 15},
    amount: {fontWeight: 'bold', fontSize: 15},
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      marginLeft: 7,
      padding: 8,
    },
    smallPadding: {
      padding: 3,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      borderRadius: 0,
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
