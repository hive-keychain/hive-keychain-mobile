import OperationThemed from 'components/operations/OperationThemed';
import Loader from 'components/ui/Loader';
import RotationIconAnimated from 'components/ui/RotationIconAnimated';
import Separator from 'components/ui/Separator';
import {ISwap} from 'hive-keychain-commons';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';

const SwapHistory = ({activeAccount}: PropsFromRedux) => {
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
      //TODO refresh bellow
      //   refresh();
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
    console.log({result}); //TODO remove line
    setHistory(result);
    setAutoRefreshCountdown(SwapsConfig.autoRefreshHistoryPeriodSec);
    setRefresh(false);
  };

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  const renderSwapHistoryItem = (item: ISwap) => {
    return (
      <View style={[getCardStyle(theme).defaultCardItem]}>
        <Text style={styles.textBase}>{item.id}</Text>
      </View>
    );
  };

  return !loading ? (
    <OperationThemed
      additionalSVGOpacity={0.6}
      childrenTop={
        <>
          <Separator height={50} />
          {!!autoRefreshCountdown && (
            <View style={[styles.flexRowRight, styles.marginRight]}>
              <Text style={styles.textBase}>
                {translate('wallet.operations.swap.swap_refresh_countdown', {
                  count: autoRefreshCountdown,
                })}
              </Text>
              <RotationIconAnimated
                theme={theme}
                //TODO add state bellow
                animate={shouldRefresh}
                //TODO add handler bellow
                onPressIcon={() => {}}
              />
            </View>
          )}
          <Separator height={10} />
        </>
      }
      childrenMiddle={
        <>
          <Separator />
          {history.length > 0 && (
            <FlatList
              data={history}
              renderItem={(item) => renderSwapHistoryItem(item.item)}
            />
          )}
        </>
      }
    />
  ) : (
    <View style={styles.loaderContainer}>
      <Loader animating size={'small'} />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    flexRowRight: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    marginRight: {
      marginRight: 20,
    },
  });

const connector = connect((state: RootState) => {
  return {
    activeAccount: state.activeAccount,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SwapHistory);
