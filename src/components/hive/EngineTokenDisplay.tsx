import {TokenHistoryProps} from 'components/history/hive-engine/TokensHistory';
import React, {memo, useCallback} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {
  Token,
  TokenBalance,
  TokenMarket,
} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {RootState} from 'store';
import {
  getHiveEngineTokenPriceInfo,
  getHiveEngineTokenValue,
} from 'utils/hiveEngine.utils';
import {navigate} from 'utils/navigation.utils';
import CurrencyIcon from './CurrencyIcon';
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

  const tokenInfo = tokensList.find((t: Token) => t.symbol === token.symbol);
  const tokenMarket = market.find(
    (t: TokenMarket) => t.symbol === token.symbol,
  );

  const onHandleGoToTokenHistory = useCallback(() => {
    navigate('TokensHistory', {
      currency: token.symbol,
      tokenBalance: token.balance,
      tokenLogo: (
        <CurrencyIcon
          currencyName={token.symbol}
          tokenInfo={tokenInfo}
          colors={colors}
          symbol={token.symbol}
        />
      ),
      theme: theme,
    } as TokenHistoryProps);
  }, [token.symbol, token.balance, tokenInfo, colors, theme]);

  if (!tokenInfo) return null;

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
        price={getHiveEngineTokenPriceInfo(tokenMarket, tokenInfo, hivePrice)}
        logo={
          <CurrencyIcon
            currencyName={token.symbol}
            addBackground={true}
            tokenInfo={tokenInfo}
            colors={colors}
            symbol={token.symbol}
          />
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

const mapStateToProps = (state: RootState) => {
  return {
    hivePrice: state.currencyPrices?.hive?.usd,
    colors: state.colors,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const areEqualOwnProps = (
  prevProps: Readonly<Props>,
  nextProps: Readonly<Props>,
) => {
  return (
    prevProps.toggled === nextProps.toggled &&
    prevProps.token === nextProps.token &&
    prevProps.tokensList === nextProps.tokensList &&
    prevProps.market === nextProps.market
  );
};

export default memo(connector(EngineTokenDisplay), areEqualOwnProps);
