import OperationThemed from 'components/operations/OperationThemed';
import Loader from 'components/ui/Loader';
import RotationIconAnimated from 'components/ui/RotationIconAnimated';
import Separator from 'components/ui/Separator';
import {ISwap} from 'hive-keychain-commons';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import SwapHistoryItem from './SwapHistoryItem';

const SwapHistory = ({activeAccount}: PropsFromRedux) => {
  const [history, setHistory] = useState<ISwap[]>([]);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<
    number | null
  >(null);
  const [shouldRefresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  //TODO cleanup code bellow
  // const renderSwapItemStatusIndicator = (status: SwapStatus) => {
  //   let iconName = '';
  //   switch (status) {
  //     case SwapStatus.COMPLETED:
  //       iconName = 'check';
  //       break;
  //     case SwapStatus.STARTED:
  //     case SwapStatus.PENDING:
  //       iconName = 'back_time';
  //       break;
  //     case SwapStatus.CANCELED_DUE_TO_ERROR:
  //     case SwapStatus.FUNDS_RETURNED:
  //     case SwapStatus.REFUNDED_SLIPPAGE:
  //       iconName = 'close_circle';
  //       break;
  //     default:
  //       iconName = 'back_time';
  //       break;
  //   }
  //   return <Icon theme={theme} name={iconName} />;
  // };

  // const renderSwapHistoryItem = (item: ISwap) => {
  //   return (
  //     <View
  //       style={[getCardStyle(theme).defaultCardItem, styles.flexRowBetween]}>
  //       <Icon theme={theme} name="repeat" bgImage={<BackgroundIconRed />} />
  //       <View style={styles.flexRowCentered}>
  //         <Text style={styles.textBase}>
  //           {item.received ? item.received : '...'} {item.endToken}
  //         </Text>
  //         <Icon theme={theme} name="repeat-circle" />
  //         <Text style={styles.textBase}>
  //           {item.amount} {item.startToken}
  //         </Text>
  //       </View>
  //       <Icon
  //         theme={theme}
  //         name="expand_thin"
  //         //TODO add state bellow
  //         onClick={() => {}}
  //         {...styles.smallIcon}
  //       />
  //       {renderSwapItemStatusIndicator(item.status)}
  //     </View>
  //   );
  // };

  return !loading ? (
    <OperationThemed
      additionalSVGOpacity={0.6}
      childrenTop={
        <>
          <Separator height={50} />
          {autoRefreshCountdown ? (
            <View style={[styles.flexRowRight, styles.marginRight]}>
              <Text style={[styles.textBase, styles.smallMarginRight]}>
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
          ) : (
            <Separator height={21} />
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
              renderItem={(item) => (
                <SwapHistoryItem
                  theme={theme}
                  item={item.item}
                  currentIndex={item.index}
                />
              )}
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
//TODO bellow cleanup unused
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
    smallMarginRight: {
      marginRight: 5,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    smallIcon: {
      width: 14,
      height: 14,
    },
    flexRowCentered: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

const connector = connect((state: RootState) => {
  return {
    activeAccount: state.activeAccount,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SwapHistory);
