import Background from 'components/ui/Background';
import {BackgroundHexagons} from 'components/ui/BackgroundHexagons';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import RotationIconAnimated from 'components/ui/RotationIconAnimated';
import Separator from 'components/ui/Separator';
import {ISwap} from 'hive-keychain-commons';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import {BackToTopButton} from '../ui/Back-To-Top-Button';
import SwapHistoryItem from './SwapHistoryItem';

const SwapHistory = ({activeAccount}: PropsFromRedux) => {
  const [history, setHistory] = useState<ISwap[]>([]);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<
    number | null
  >(null);
  const [shouldRefresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);

  const flatListRef = useRef();

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

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader animating size={'small'} />
      </View>
    );
  } else {
    return (
      <Background theme={theme} additionalBgSvgImageStyle={styles.hexagons}>
        <>
          <BackgroundHexagons theme={theme} />
          <FocusAwareStatusBar />
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
                animate={shouldRefresh}
                onPressIcon={refresh}
                color={getColors(theme).secondaryText}
              />
            </View>
          ) : (
            <Separator height={21} />
          )}
          <Separator height={10} />
          <FlatList
            ref={flatListRef}
            data={history}
            style={[getCardStyle(theme).roundedCardItem, styles.listContainer]}
            renderItem={(item) => (
              <SwapHistoryItem
                theme={theme}
                item={item.item}
                currentIndex={item.index}
              />
            )}
            ListEmptyComponent={() => {
              return (
                <View style={styles.flex}>
                  <Text style={styles.textBase}>
                    {translate('wallet.operations.swap.swap_no_history')}
                  </Text>
                </View>
              );
            }}
            onScroll={handleScroll}
            ListFooterComponent={<Separator />}
          />
          {displayScrollToTop && (
            <BackToTopButton theme={theme} element={flatListRef} />
          )}
        </>
      </Background>
    );
  }
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    listContainer: {
      paddingTop: 15,
      paddingHorizontal: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    flex: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
    hexagons: {
      bottom: undefined,
      top: theme === Theme.LIGHT ? -30 : 30,
    },
  });

const connector = connect((state: RootState) => {
  return {
    activeAccount: state.activeAccount,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SwapHistory);
