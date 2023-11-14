import {clearUserTransactions, fetchAccountTransactions} from 'actions/index';
import {clearWalletFilters, updateWalletFilter} from 'actions/walletFilters';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {Transaction} from 'src/interfaces/transaction.interface';
import {getColors} from 'src/styles/colors';
import {fields_primary_text_1} from 'src/styles/typography';
import {RootState} from 'store';
import ArrayUtils from 'utils/array.utils';
import {getMainLocale, translate} from 'utils/localize';
import TransactionUtils, {
  MINIMUM_FETCHED_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
} from 'utils/transactions.utils';
import {WalletHistoryUtils} from 'utils/walletHistoryUtils';
import {BackToTopButton} from './Back-To-Top-Button';
import Icon from './Icon';
import WalletHistoryItemComponent from './WalletHistoryItemComponent';

type FilterTransactionTypes = {
  [key: string]: boolean;
};

const DEFAULT_FILTER: WalletHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    transfer: false,
    claim_reward_balance: false,
    delegate_vesting_shares: false,
    claim_account: false,
    savings: false,
    power_up_down: false,
    convert: false,
  },
};

type WalletHistoryFilter = {
  filterValue: string;
  inSelected: boolean;
  outSelected: boolean;
  selectedTransactionTypes: FilterTransactionTypes;
};

export interface WalletHistoryComponentProps {
  currency?: string;
}

const WallettHistory = ({
  transactions,
  activeAccount,
  fetchAccountTransactions,
  walletFilters,
  updateWalletFilter,
  clearUserTransactions,
  currency,
}: PropsFromRedux & WalletHistoryComponentProps) => {
  console.log('fomr params: ', {currency}); //TODO remove line
  let lastOperationFetched = -1;

  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >(transactions.list);

  const locale = getMainLocale();

  const [lastTransactionIndex, setLastTransactionIndex] = useState<number>(-1);

  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);

  const flatListRef = useRef();

  const childRef = useRef();

  const [loading, setLoading] = useState(true);

  const [previousTransactionLength, setPreviousTransactionLength] = useState(0);

  const [bottomLoader, setBottomLoader] = useState(true);

  const [isFilterOpened, setIsFilterPanelOpened] = useState(false);

  const [filteringCounter, setFilteringCounter] = useState(0);

  const toggleFilter = () => {
    setIsFilterPanelOpened(!isFilterOpened);
  };

  useEffect(() => {
    if (activeAccount.name) {
      init();
      return () => {
        clearUserTransactions();
        setFilteringCounter(0);
      };
    }
  }, [activeAccount.name]);

  //TODO test if bellow works
  // useEffect(() => {
  //   console.log('Walletfilters been set!, should filter!'); //TODO remove line
  // }, [walletFilters]);
  //end Test

  const finalizeDisplayedList = (list: Transaction[]) => {
    setDisplayedTransactions(list);
    setLoading(false);
    setBottomLoader(false);
  };

  const init = async () => {
    setLoading(true);
    lastOperationFetched = await TransactionUtils.getLastTransaction(
      activeAccount.name!,
    );

    fetchAccountTransactions(activeAccount.name!, lastOperationFetched);
    //TODO bellow, cleanup unused code + mark wallet-history-filter-panel as "//TODO check if needed after refactoring UI"
    // if (childRef.current) {
    //   //@ts-ignore
    //   childRef.current.initFiltersNow();
    // }
    // filterTransactions();
  };

  useEffect(() => {
    if (transactions.lastUsedStart !== -1) {
      if (
        transactions.list.length < MINIMUM_FETCHED_TRANSACTIONS &&
        !transactions.list.some((t) => t.last)
      ) {
        if (transactions.lastUsedStart === 1) {
          setLoading(false);
          return;
        }
        setLoading(true);
        fetchAccountTransactions(
          activeAccount.name!,
          transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
        );
      } else {
        setTimeout(() => {
          // if (childRef.current) {
          //   //@ts-ignore
          //   childRef.current.filterNow();
          //   setFilteringCounter((prevCount: number) => prevCount + 1);
          // }
          setFilteringCounter((prevCount: number) => prevCount + 1);
          filterTransactions();
        }, 0);

        setLastTransactionIndex(
          ArrayUtils.getMinValue(transactions.list, 'index'),
        );
      }
    }
    //TODO testing if needed bellow as dependency walletFilters to filter on each change!
  }, [transactions, walletFilters]);

  const filterTransactions = () => {
    let walletFiltersTemp = walletFilters;
    if (currency) walletFilters.filterValue = currency;
    let filteredTransactions = WalletHistoryUtils.applyAllFilters(
      transactions.list,
      walletFiltersTemp,
      activeAccount,
    );
    if (
      (filteredTransactions.length >= MINIMUM_FETCHED_TRANSACTIONS &&
        filteredTransactions.length >= previousTransactionLength + 1) ||
      transactions.list.some((t) => t.last) ||
      transactions.lastUsedStart === 0
    ) {
      finalizeDisplayedList(filteredTransactions);
    } else {
      setBottomLoader(true);
      fetchAccountTransactions(
        activeAccount.name!,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      );
    }
  };

  const forceResetFilters = () => {
    if (childRef.current) {
      setFilteringCounter(0);
      //@ts-ignore
      childRef.current.forceResetFilters();
    }
  };

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  const renderListItem = (transaction: Transaction) => {
    return (
      <WalletHistoryItemComponent
        transaction={transaction}
        user={activeAccount}
        locale={locale}
        theme={theme}
      />
    );
  };

  const tryToLoadMore = () => {
    if (loading) return;
    setPreviousTransactionLength(displayedTransactions.length);
    setBottomLoader(true);
    fetchAccountTransactions(
      activeAccount.name!,
      Math.min(
        lastTransactionIndex,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      ),
    );
  };

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
    if (
      transactions.list[transactions.list.length - 1]?.last === true ||
      transactions.lastUsedStart === 0
    )
      return;
  };

  return (
    <View style={styles.flex}>
      <FocusAwareStatusBar />
      {/* <WalletHistoryFilterPanel
        ref={childRef}
        DEFAULT_WALLET_FILTER={walletFilters}
        transactions={transactions}
        flatListRef={flatListRef}
        activeAccount={activeAccount}
        setDisplayedTransactions={setDisplayedTransactions}
        setPreviousTransactionLength={setPreviousTransactionLength}
        previousTransactionLength={previousTransactionLength}
        finalizeDisplayedList={finalizeDisplayedList}
        fetchAccountTransactions={fetchAccountTransactions}
        walletFilters={walletFilters}
        updateWalletFilter={updateWalletFilter}
        clearWalletFilters={clearWalletFilters}
        setBottomLoader={setBottomLoader}
        loading={loading}
        isFilterOpened={isFilterOpened}
        toggleFilter={toggleFilter}
        setLoading={setLoading}
        displayedTransactions={displayedTransactions}
      /> */}

      {!loading && displayedTransactions.length > 0 && (
        <View style={styles.viewContainer}>
          <FlatList
            ref={flatListRef}
            data={displayedTransactions}
            initialNumToRender={20}
            onEndReachedThreshold={0.5}
            renderItem={(transaction) => renderListItem(transaction.item)}
            keyExtractor={(transaction) => transaction.key}
            style={styles.transactionsList}
            onScroll={handleScroll}
            onEndReached={() => {
              if (
                transactions.list.length &&
                transactions.list[transactions.list.length - 1].last
              ) {
                const isLast =
                  transactions.list[transactions.list.length - 1].last;
                if (!isLast && displayedTransactions.length > 8) {
                  tryToLoadMore();
                }
              }
            }}
            ListFooterComponent={() => {
              return (
                <>
                  {transactions.list[transactions.list.length - 1]?.last ===
                    false &&
                    transactions.lastUsedStart !== 0 &&
                    !loading &&
                    !bottomLoader && (
                      <TouchableOpacity
                        style={styles.loadMorePanel}
                        onPress={() => tryToLoadMore()}>
                        <Text style={styles.textBase}>
                          {translate('wallet.operations.history.load_more')}
                        </Text>
                        <Icon name={Icons.ADD_CIRCLE} />
                      </TouchableOpacity>
                    )}
                  {/* BOTTOM LOADER */}
                  {!loading && bottomLoader && (
                    <View style={styles.centeredContainer}>
                      <Loader animating size={'small'} />
                    </View>
                  )}
                  {/* END BOTTOM LOADER */}
                </>
              );
            }}
          />
        </View>
      )}

      {/* results on applied filter */}
      {!loading &&
        displayedTransactions.length === 0 &&
        transactions.list.length > 0 && (
          <View
            style={[
              {flex: 1},
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Text style={styles.textBase}>
              {translate(
                'wallet.operations.history.list_is_empty_try_clear_filter',
              )}
            </Text>
          </View>
        )}
      {/* END results */}

      {/* LOADER */}
      {loading && (
        <View style={styles.renderTransactions}>
          <Separator height={120} />
          <Loader animating />
          {filteringCounter > 40 ? (
            <TouchableOpacity
              style={styles.centered}
              onPress={forceResetFilters}>
              <Text style={[styles.textBase, styles.alertText]}>
                {translate('wallet.operations.history.reset_filters')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Separator height={120} />
          )}
        </View>
      )}
      {/* END LOADER */}

      {/* ScrollToTop Button */}
      {!loading && displayScrollToTop && (
        <BackToTopButton theme={theme} element={flatListRef} />
      )}
      {/* END ScrollToTop Button */}

      {/* //testing counter */}

      {/* end testing */}
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    transactions: state.transactions,
    activeAccount: state.activeAccount,
    walletFilters: state.walletFilters,
  };
};

const connector = connect(mapStateToProps, {
  fetchAccountTransactions,
  updateWalletFilter,
  clearWalletFilters,
  clearUserTransactions,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    renderTransactions: {
      flex: 1,
      justifyContent: 'center',
    },
    flex: {flex: 1},
    transactionsList: {
      marginBottom: 10,
    },
    centeredContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
    },
    viewContainer: {
      height: '100%',
    },
    loadMorePanel: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertText: {
      marginTop: 30,
      fontWeight: 'bold',
      marginBottom: 80,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
  });

export const WalletHistoryComponent = connector(WallettHistory);
