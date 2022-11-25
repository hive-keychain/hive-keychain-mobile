import AsyncStorage from '@react-native-community/async-storage';
import {clearUserTransactions, fetchAccountTransactions} from 'actions/index';
import {clearWalletFilters, updateWalletFilter} from 'actions/walletFilters';
import Loader from 'components/ui/Loader';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Icons} from 'src/enums/icons.enums';
import {
  ClaimReward,
  CollateralizedConvert,
  Convert,
  Delegation,
  DepositSavings,
  FillCollateralizedConvert,
  FillConvert,
  PowerDown,
  PowerUp,
  ReceivedInterests,
  Transaction,
  Transactions,
  Transfer,
  WithdrawSavings,
} from 'src/interfaces/transaction.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {RootState} from 'store';
import ArrayUtils from 'utils/array.utils';
import {getMainLocale, translate} from 'utils/localize';
import TransactionUtils, {
  HAS_IN_OUT_TRANSACTIONS,
  MINIMUM_FETCHED_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
  TRANSFER_TYPE_TRANSACTIONS,
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

//TODO  - fix for one user
//          - must load transfers seamleasly, show bottom loader as user goes down.
//          - redux filter not getting cleared.
//      - apply clearHistory, userLoading on activeAccount changes.
//      - delete wallet-history-component.tsx & wallet-history-filter-panel.tsx
//      - rename wallet-test-history.tsx -> wallet-history-component.

const WalletTestHistory = ({
  transactions,
  activeAccount,
  fetchAccountTransactions,
  walletFilters,
  updateWalletFilter,
  clearUserTransactions,
}: PropsFromRedux) => {
  const [isFilterOpened, setIsFilterPanelOpened] = useState(false);
  let lastOperationFetched = -1;

  const [filter, setFilter] = useState<WalletHistoryFilter>(DEFAULT_FILTER);
  const [filterReady, setFilterReady] = useState<boolean>(false);

  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >(transactions.list);

  const locale = getMainLocale();

  const [lastTransactionIndex, setLastTransactionIndex] = useState<number>(-1);

  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);

  const flatListRef = useRef();

  const [previousTransactionLength, setPreviousTransactionLength] = useState(0);

  const [bottomLoader, setBottomLoader] = useState(false);

  const toggleFilter = () => {
    setIsFilterPanelOpened(!isFilterOpened);
  };

  const toggleFilterType = (transactionName: string) => {
    const newFilter = {
      ...filter?.selectedTransactionTypes,
      [transactionName]: !filter?.selectedTransactionTypes![transactionName],
    };
    updateFilter({
      ...filter,
      selectedTransactionTypes: newFilter,
    });
  };

  const toggleFilterIn = () => {
    const newFilter = {
      ...filter,
      inSelected: !filter.inSelected,
    };
    updateFilter(newFilter);
  };

  const toggleFilterOut = () => {
    const newFilter = {
      ...filter,
      outSelected: !filter.outSelected,
    };
    updateFilter(newFilter);
  };

  const updateFilterValue = (value: string) => {
    const newFilter = {
      ...filter,
      filterValue: value,
    };
    updateFilter(newFilter);
  };

  const updateFilter = (filter: any) => {
    setFilter(filter);
    //   setTimeout(() => {
    //     walletItemList?.current?.scrollTo({
    //       top: 0,
    //       left: 0,
    //       behavior: 'smooth',
    //     });
    //   }, 200);
  };

  useEffect(() => {
    init();
    return () => {
      console.log('I have been unmounted!!'); //TODO remove cleanUp if not needed
      clearUserTransactions();
    };
  }, []);

  const finalizeDisplayedList = (list: Transaction[]) => {
    setDisplayedTransactions(list);
  };

  const init = async () => {
    clearUserTransactions();
    lastOperationFetched = await TransactionUtils.getLastTransaction(
      activeAccount.name!,
    );
    console.log({lastOperationFetched}); //TODO to remove
    fetchAccountTransactions(activeAccount.name!, lastOperationFetched);
    initFilters();
  };

  useEffect(() => {
    if (transactions.lastUsedStart !== -1) {
      if (
        transactions.list.length < MINIMUM_FETCHED_TRANSACTIONS &&
        !transactions.list.some((t) => t.last)
      ) {
        fetchAccountTransactions(
          activeAccount.name!,
          transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
        );
      } else {
        setTimeout(() => {
          filterTransactions();
        }, 0);

        setLastTransactionIndex(
          ArrayUtils.getMinValue(transactions.list, 'index'),
        );
      }
    }
  }, [transactions]);

  const initFilters = async () => {
    // setFilter(walletFilters);
    const filter = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.WALLET_HISTORY_FILTERS,
    );
    if (filter) {
      setFilter(JSON.parse(filter));
    }
    setFilterReady(true);
  };

  useEffect(() => {
    setPreviousTransactionLength(0);
    if (filterReady) {
      filterTransactions();
      saveFilterInLocalStorage();
    }
  }, [filter]);

  const saveFilterInLocalStorage = async () => {
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.WALLET_HISTORY_FILTERS,
      JSON.stringify(filter),
    );
    // updateWalletFilter(filter);
  };

  //TODO to remove
  // useEffect(() => {
  //   console.log({walletFilters});
  // }, [walletFilters]);
  //END to remove

  const filterTransactions = () => {
    const selectedTransactionsTypes = Object.keys(
      filter.selectedTransactionTypes,
    ).filter(
      (transactionName) => filter.selectedTransactionTypes[transactionName],
    );
    let filteredTransactions = transactions.list.filter(
      (transaction: Transaction) => {
        const isInOrOutSelected = filter.inSelected || filter.outSelected;
        if (
          selectedTransactionsTypes.includes(transaction.type) ||
          selectedTransactionsTypes.length === 0
        ) {
          if (
            HAS_IN_OUT_TRANSACTIONS.includes(transaction.type) &&
            isInOrOutSelected
          ) {
            return (
              (filter.inSelected &&
                ((TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
                  (transaction as Transfer).to === activeAccount.name!) ||
                  (transaction.type === 'delegate_vesting_shares' &&
                    (transaction as Delegation).delegatee ===
                      activeAccount.name!))) ||
              (filter.outSelected &&
                ((TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
                  (transaction as Transfer).from === activeAccount.name!) ||
                  (transaction.type === 'delegate_vesting_shares' &&
                    (transaction as Delegation).delegator ===
                      activeAccount.name!)))
            );
          } else {
            return true;
          }
        }
      },
    );
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return (
        (TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
          WalletHistoryUtils.filterTransfer(
            transaction as Transfer,
            filter.filterValue,
            activeAccount.name!,
          )) ||
        (transaction.type === 'claim_reward_balance' &&
          WalletHistoryUtils.filterClaimReward(
            transaction as ClaimReward,
            filter.filterValue,
          )) ||
        (transaction.type === 'delegate_vesting_shares' &&
          WalletHistoryUtils.filterDelegation(
            transaction as Delegation,
            filter.filterValue,
            activeAccount.name!,
          )) ||
        (transaction.subType === 'withdraw_vesting' &&
          WalletHistoryUtils.filterPowerUpDown(
            transaction as PowerDown,
            filter.filterValue,
          )) ||
        (transaction.subType === 'transfer_to_vesting' &&
          WalletHistoryUtils.filterPowerUpDown(
            transaction as PowerUp,
            filter.filterValue,
          )) ||
        (transaction.subType === 'transfer_from_savings' &&
          WalletHistoryUtils.filterSavingsTransaction(
            transaction as WithdrawSavings,
            filter.filterValue,
          )) ||
        (transaction.subType === 'transfer_to_savings' &&
          WalletHistoryUtils.filterSavingsTransaction(
            transaction as DepositSavings,
            filter.filterValue,
          )) ||
        (transaction.subType === 'interest' &&
          WalletHistoryUtils.filterInterest(
            transaction as ReceivedInterests,
            filter.filterValue,
          )) ||
        (transaction.subType === 'fill_collateralized_convert_request' &&
          WalletHistoryUtils.filterFillConversion(
            transaction as FillCollateralizedConvert,
            filter.filterValue,
          )) ||
        (transaction.subType === 'fill_convert_request' &&
          WalletHistoryUtils.filterFillConversion(
            transaction as FillConvert,
            filter.filterValue,
          )) ||
        (transaction.subType === 'collateralized_convert' &&
          WalletHistoryUtils.filterConversion(
            transaction as CollateralizedConvert,
            filter.filterValue,
          )) ||
        (transaction.subType === 'convert' &&
          WalletHistoryUtils.filterConversion(
            transaction as Convert,
            filter.filterValue,
          )) ||
        (transaction.timestamp &&
          moment(transaction.timestamp)
            .format('L')
            .includes(filter.filterValue.toLowerCase()))
      );
    });
    if (
      (filteredTransactions.length >= MINIMUM_FETCHED_TRANSACTIONS &&
        filteredTransactions.length >= previousTransactionLength + 1) ||
      transactions.list.some((t) => t.last) ||
      transactions.lastUsedStart === 0
    ) {
      finalizeDisplayedList(filteredTransactions);
    } else {
      fetchAccountTransactions(
        activeAccount.name!,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      );
    }
  };

  const clearFilters = () => {
    // updateWalletFilter(DEFAULT_FILTER);
    setFilter(DEFAULT_FILTER);
    // setFilter(DEFAULT_FILTER);
  };

  const renderListItem = (transaction: Transaction) => {
    return (
      <WalletHistoryItemComponent
        transaction={transaction}
        user={activeAccount}
        locale={locale}
      />
    );
  };

  const tryToLoadMore = () => {
    setPreviousTransactionLength(displayedTransactions.length);
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

    console.log('trLastUsed: ', transactions.lastUsedStart); //TODO to remove
    console.log(
      'last: ',
      transactions.list[transactions.list.length - 1]?.last,
    ); //TODO to remove
    if (
      transactions.list[transactions.list.length - 1]?.last === true ||
      transactions.lastUsedStart === 0
    )
      return;

    // if (
    //   event.target.scrollHeight - event.target.scrollTop ===
    //   event.target.clientHeight
    // ) {
    //   tryToLoadMore();
    // }
  };

  const handlePressedStyleFilterOperations = (filterOperationType: string) => {
    return filter.selectedTransactionTypes[filterOperationType]
      ? styles.filterSelectorItemPressed
      : styles.filterSelectorItem;
  };

  const handlePressedStyleInOut = (inOutSelected: boolean) => {
    return inOutSelected ? styles.inOutPressedItem : styles.inOutItem;
  };

  return (
    <View style={styles.flex}>
      {!!displayedTransactions.length && (
        <View aria-label="wallet-history-filter-panel">
          <View style={styles.filterTogglerContainer}>
            <View style={styles.filterTogglerInnerContainer}>
              <Text style={styles.filterTitleText}>
                {translate('wallet.filter.filters_title')}
              </Text>
              <TouchableOpacity
                style={styles.circularContainer}
                onPress={() => toggleFilter()}>
                {isFilterOpened ? (
                  <Icon name={Icons.EXPAND_LESS} marginRight={false} />
                ) : (
                  <Icon name={Icons.EXPAND_MORE} marginRight={false} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {isFilterOpened && (
            <View style={styles.filtersContainer}>
              <View style={styles.searchPanel}>
                <TextInput
                  style={styles.customInputStyle}
                  placeholder={translate('common.search_box_placeholder')}
                  value={filter.filterValue}
                  onChangeText={updateFilterValue}
                />
                <TouchableOpacity
                  style={styles.touchableItem}
                  aria-label="clear-filters"
                  onPress={() => clearFilters()}>
                  <Text>{translate('wallet.filter.clear_filters')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filterSelectors}>
                <View style={styles.filterSelectorContainer}>
                  {filter.selectedTransactionTypes &&
                    Object.keys(filter.selectedTransactionTypes).map(
                      (filterOperationType) => (
                        <TouchableOpacity
                          style={handlePressedStyleFilterOperations(
                            filterOperationType,
                          )}
                          aria-label={`filter-selector-${filterOperationType}`}
                          key={filterOperationType}
                          onPress={() => toggleFilterType(filterOperationType)}>
                          <Text>
                            {translate(`wallet.filter.${filterOperationType}`)}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                </View>
                <View>
                  <TouchableOpacity
                    style={handlePressedStyleInOut(filter.inSelected)}
                    aria-label="filter-by-incoming"
                    onPress={() => toggleFilterIn()}>
                    <Text>{translate('wallet.filter.filter_in')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={handlePressedStyleInOut(filter.outSelected)}
                    aria-label="filter-by-outgoing"
                    onPress={() => toggleFilterOut()}>
                    <Text>{translate('wallet.filter.filter_out')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {!!displayedTransactions.length && (
        <FlatList
          ref={flatListRef}
          data={displayedTransactions}
          initialNumToRender={20}
          onEndReachedThreshold={0.5}
          renderItem={(transaction) => renderListItem(transaction.item)}
          keyExtractor={(transaction) => transaction.key}
          style={styles.transactionsList}
          //   renderOnScroll
          //   renderWhenEmpty={() => {
          //     if (loading) {
          //       return <div></div>;
          //     } else {
          //       return (
          //         <div className="empty-list">
          //           <Icon name={Icons.INBOX} type={IconType.OUTLINED}></Icon>
          //           <div className="labels">
          //             <span>
          //               {chrome.i18n.getMessage(
          //                 'popup_html_transaction_list_is_empty',
          //               )}
          //             </span>
          //             <span>
          //               {chrome.i18n.getMessage(
          //                 'popup_html_transaction_list_is_empty_try_clear_filter',
          //               )}
          //             </span>
          //           </div>
          //         </div>
          //       );
          //     }
          //   }}
          ListEmptyComponent={() => {
            // console.log('Within ListEmptyComponent: ', {loading}); //TODO to remove
            if (!displayedTransactions.length) {
              return null;
            } else {
              return (
                <View
                  style={[
                    styles.flex,
                    styles.justifyAlignedCenteredFixedHeight,
                  ]}>
                  <Text>
                    {translate('common.list_is_empty_try_clear_filter')}
                  </Text>
                </View>
              );
            }
          }}
          onScroll={handleScroll}
          onEndReached={() => {
            const isLast = transactions.list[transactions.list.length - 1].last;
            const isLastFetched =
              transactions.list[transactions.list.length - 1].lastFetched;
            // console.log('onEndReached fired!', {
            //   isLast,
            //   isLastFetched,
            //   isThereALast: transactions.list.some((tr) => tr.last),
            //   // list: transactions.list,
            // }); //TODO to remove
            if (!isLast) {
              tryToLoadMore();
            }
          }}
        />
      )}

      {/* LOADER */}
      {!displayedTransactions.length && (
        <View style={styles.renderTransactions}>
          <Loader animating />
        </View>
      )}
      {/* END LOADER */}

      {/* BOTTOM LOADER */}
      {bottomLoader && displayedTransactions.length >= 0 && (
        <View style={styles.centeredContainer}>
          <Loader animating size={'small'} />
        </View>
      )}
      {/* END BOTTOM LOADER */}

      {/* ScrollToTop Button */}
      {!!displayedTransactions.length && displayScrollToTop && (
        <BackToTopButton element={flatListRef} />
      )}
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    transactions: state.transactions as Transactions,
    activeAccount: state.activeAccount,
    walletFilters: state.walletFilters, //TODO use it
  };
};

const connector = connect(mapStateToProps, {
  fetchAccountTransactions,
  updateWalletFilter,
  clearWalletFilters,
  clearUserTransactions,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const styles = StyleSheet.create({
  renderTransactions: {
    flex: 1,
    justifyContent: 'center',
  },
  flex: {flex: 1},
  justifyAlignedCenteredFixedHeight: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  filtersContainer: {
    flexDirection: 'column',
  },
  filterTogglerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTogglerInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  circularContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 100,
    margin: 4,
    height: 22,
    width: 22,
  },
  filterTogglerText: {
    color: 'black',
    fontWeight: 'bold',
  },
  inOutItem: {
    borderColor: 'black',
    width: 65,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inOutPressedItem: {
    borderColor: 'black',
    width: 65,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b1aeae',
  },
  touchableItem: {
    borderColor: 'black',
    width: '20%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSelectors: {
    flexDirection: 'row',
  },
  filterSelectorContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  filterSelectorItem: {
    width: '45%',
    margin: 4,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  filterSelectorItemPressed: {
    width: '45%',
    margin: 4,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#b1aeae',
  },
  pressedStyle: {
    borderColor: 'black',
    width: '20%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b1aeae',
  },
  customInputStyle: {
    width: '72%',
    height: 40,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    marginLeft: 4,
    padding: 6,
  },
  searchPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  filterTitleText: {
    fontWeight: 'bold',
  },
  transactionsList: {
    marginBottom: 33,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export const WalletTestHistoryComponent = connector(WalletTestHistory);
