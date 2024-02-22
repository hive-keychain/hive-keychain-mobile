import {TokenBalance, TokenMarket} from 'actions/interfaces';
import {clearTokensFilters} from 'actions/tokensFilters';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import React, {useRef, useState} from 'react';
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
  setToggle: (yPosElement: number) => void;
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
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles(
    {width},
    theme,
    token.symbol,
    addBackground,
  );
  const [hasError, setHasError] = useState(false);
  const tokenInfo = tokensList.find((t) => t.symbol === token.symbol);
  const tokenMarket = market.find((t) => t.symbol === token.symbol);

  const mainViewRef = useRef();

  if (!tokenInfo) return null;

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
      style={styles.iconBase}
      source={{
        uri: tokenInfo.metadata.icon,
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

  const onClickMeasure = async () =>
    new Promise<number>((resolve, reject) => {
      if (mainViewRef && mainViewRef.current) {
        (mainViewRef.current as any).measureInWindow(
          (pageX: any, pageY: any, width: any, height: any) => {
            //TODO cleanup
            // console.log('Item meassures when clicked: ', {
            //   pageX,
            //   pageY,
            //   width,
            //   height,
            // }); //TODO remove line
            resolve(pageY);
          },
        );
      } else resolve(0);
    });

  // const onClickMeasure = () => {
  //   let yPosFound = 0;
  //   if (mainViewRef && mainViewRef?.current) {
  //     (mainViewRef.current as any).measureInWindow(
  //       (pageX: any, pageY: any, width: any, height: any) => {
  //         console.log('Item meassures when clicked: ', {
  //           pageX,
  //           pageY,
  //           width,
  //           height,
  //         }); //TODO remove line
  //         yPosFound = pageY;
  //       },
  //     );
  //   }
  //   return yPosFound;
  // };

  return (
    <View
      style={[getCardStyle(theme).wrapperCardItem, {zIndex: 11}]}
      ref={mainViewRef}>
      <TokenDisplay
        name={tokenInfo.name}
        currency={token.symbol}
        color="black"
        value={parseFloat(token.balance)}
        totalValue={getHiveEngineTokenValue(token, market)}
        toggled={toggled}
        setToggle={async () => {
          const itemPageY = await onClickMeasure();
          console.log({itemPageY});
          setToggle(itemPageY);
        }}
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
    </View>
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
        ? getBackgroundColorFromBackend(symbol, theme)
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
