import Icon from 'components/hive/Icon';
import TokenSwapHistoryItem from 'components/hive/TokenSwapHistoryItem';
import Loader from 'components/ui/Loader';
import {ISwap} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';

const SwapTokensHistory = ({activeAccount}: PropsFromRedux) => {
  const [history, setHistory] = useState<ISwap[]>([]);
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

  const renderListItem = (index: number, historyItem: ISwap) => {
    return (
      <TokenSwapHistoryItem
        key={`item-swap-history-${index}`}
        index={index}
        swap={historyItem}
      />
    );
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <Loader animating={loading} />
      </View>
    );
  else
    return (
      <View style={styles.container}>
        {!loading && (
          <>
            <View
              style={[
                styles.flexRowCenteredEnd,
                styles.marginTopBottom,
                styles.paddingHorizontal,
              ]}>
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
            {history.length > 0 && (
              <FlatList
                data={history}
                renderItem={(item) => renderListItem(item.index, item.item)}
                style={{
                  marginBottom: 28,
                }}
              />
            )}

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
  flexRowCenteredEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  marginTopBottom: {
    marginTop: 8,
    marginBottom: 8,
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
  };
};
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(SwapTokensHistory);
