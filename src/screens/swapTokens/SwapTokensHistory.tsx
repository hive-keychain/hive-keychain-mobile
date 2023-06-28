import {loadTokensMarket} from 'actions/hiveEngine';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Swap} from 'src/interfaces/swap-token.interface';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
//TODO add styles to const styles
const SwapTokensHistory = ({
  loadTokensMarket,
  activeAccount,
  price,
  tokenMarket,
}: PropsFromRedux) => {
  const [history, setHistory] = useState<Swap[]>([]);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<
    number | null
  >(null);
  const [shouldRefresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initSwapHistory();
  }, []);

  useEffect(() => {
    if (autoRefreshCountdown === null) {
      return;
    }

    if (autoRefreshCountdown === 0) {
      refresh();
      setAutoRefreshCountdown(SwapsConfig.autoRefreshHistoryPeriodSec);
      return;
    }

    const intervalId = setInterval(() => {
      setAutoRefreshCountdown(autoRefreshCountdown! - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRefreshCountdown]);

  const initSwapHistory = async () => {
    setLoading(true);
    await refresh();
    setLoading(false);
  };

  const refresh = async () => {
    setRefresh(true);
    const result = await SwapTokenUtils.retrieveSwapHistory(
      activeAccount.name!,
    );
    setHistory(result);
    setAutoRefreshCountdown(SwapsConfig.autoRefreshHistoryPeriodSec);
    setRefresh(false);
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <Loader animating={loading} />
      </View>
    );
  else
    return (
      <View style={[styles.container, styles.paddingHorizontal]}>
        {!loading && (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 8,
                marginBottom: 8,
              }}>
              {!!autoRefreshCountdown && (
                <>
                  <Text>
                    {translate('swapTokens.swap_refresh_countdown', {
                      autoRefreshCountdown: autoRefreshCountdown?.toString(),
                    })}
                  </Text>
                  <Icon
                    name={'refresh'}
                    onClick={() => refresh()}
                    rotate={shouldRefresh}
                  />
                </>
              )}
            </View>
            {history.length > 0 &&
              history.map((item, index) => {
                return (
                  //TODO component bellow
                  // <TokenSwapsHistoryItemComponent key={`item-${index}`} swap={item} />
                  <Text key={`item-${index}`}>{item.amount}</Text>
                );
              })}
            {history.length === 0 && (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                }}>
                <Icon name={'inbox'} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 8,
                  }}>
                  {translate('swapTokens.swap_no_history')}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
  withdrawingValue: {color: '#b8343f', fontSize: 14},
  flexRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  send: {backgroundColor: '#68A0B4', marginBottom: 20},
  title: {fontWeight: 'bold', fontSize: 16},
});

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
    price: state.currencyPrices,
    tokenMarket: state.tokensMarket,
  };
};
const connector = connect(mapStateToProps, {
  loadTokensMarket,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(SwapTokensHistory);
