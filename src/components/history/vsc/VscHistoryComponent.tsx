import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import { VscHistoryItem, VscUtils } from 'hive-keychain-commons';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConnectedProps, connect } from 'react-redux';
import { Theme, useThemeContext } from 'src/context/theme.context';
import { getColors } from 'src/styles/colors';
import { fields_primary_text_1 } from 'src/styles/typography';
import { RootState } from 'store';
import { translate } from 'utils/localize';
import { BackToTopButton } from '../../ui/Back-To-Top-Button';
import VscHistoryItemComponent from './VscHistoryItemComponent';

export interface VscHistoryComponentProps {
  currency?: string;
}

const VscHistory = ({activeAccount, route}: PropsFromRedux & {route: any}) => {
  const [currency, setCurrency] = useState('');
  const [transactions, setTransactions] = useState<VscHistoryItem[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<
    VscHistoryItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const flatListRef = useRef();
  const [bottomLoader, setBottomLoader] = useState(false);

  useEffect(() => {
    if (route.params) {
      setCurrency(route.params.currency);
    }
  }, []);

  useEffect(() => {
    if (activeAccount.name) {
      init();
    }
  }, [activeAccount.name]);

  const init = async () => {
    setLoading(true);
    try {
      const vscTransactions = await VscUtils.getOrganizedHistory(
        activeAccount.name!,
      );
      setTransactions(vscTransactions);
      setDisplayedTransactions(vscTransactions);
    } catch (error) {
      console.error('Error fetching VSC transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const {theme} = useThemeContext();
  const styles = getStyles(theme, useSafeAreaInsets());

  const renderListItem = (transaction: VscHistoryItem) => {
    return (
      <VscHistoryItemComponent
        transaction={transaction}
        user={activeAccount}
        theme={theme}
      />
    );
  };

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  return (
    <View
      style={{
        marginTop: 20,
        ...styles.flex,
      }}>
      {!loading && displayedTransactions.length > 0 && (
        <View style={styles.viewContainer}>
          <FlatList
            ref={flatListRef}
            data={displayedTransactions}
            initialNumToRender={20}
            scrollEnabled
            onEndReachedThreshold={0.5}
            renderItem={(transaction) => renderListItem(transaction.item)}
            keyExtractor={(transaction) => transaction.txId}
            style={styles.transactionsList}
            onScroll={handleScroll}
            ListFooterComponent={() => {
              return (
                <>
                  {bottomLoader && (
                    <View style={styles.centeredContainer}>
                      <Loader animating size={'small'} />
                    </View>
                  )}
                </>
              );
            }}
          />
        </View>
      )}

      {!loading && displayedTransactions.length === 0 && (
        <View
          style={[{flex: 1}, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={styles.textBase}>
            {translate('wallet.operations.history.no_transactions')}
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.renderTransactions}>
          <Separator height={120} />
          <Loader animating />
          <Separator height={120} />
        </View>
      )}

      {!loading && displayScrollToTop && (
        <BackToTopButton theme={theme} element={flatListRef} />
      )}
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    renderTransactions: {
      flex: 1,
      justifyContent: 'center',
    },
    flex: {flex: 1},
    transactionsList: {
      marginBottom: 10,
      paddingTop: 10,
    },
    centeredContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
    },
    viewContainer: {
      height: '100%',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      overflow: 'hidden',
      paddingHorizontal: 10,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
  });

export const VscHistoryComponent = connector(VscHistory);
