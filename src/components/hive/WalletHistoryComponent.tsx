import {fetchAccountTransactions, initAccountTransactions} from 'actions/hive';
import {ActiveAccount} from 'actions/interfaces';
import CustomInput from 'components/form/CustomInput';
import Loader from 'components/ui/Loader';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
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
import {addRandomToKeyString} from 'utils/format';
import {getFromKeychain, saveOnKeychain} from 'utils/keychainStorage';
import {getMainLocale, translate} from 'utils/localize';
import TransactionUtils, {
  HAS_IN_OUT_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
  TRANSFER_TYPE_TRANSACTIONS,
} from 'utils/transactions.utils';
import {WalletHistoryUtils} from 'utils/walletHistoryUtils';
import {WalletHistoryItemComponent} from './WalletHistoryItemComponent';

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
const MINIMUM_FETCHED_TRANSACTIONS = 1;

type WalletHistoryFilter = {
  filterValue: string;
  inSelected: boolean;
  outSelected: boolean;
  selectedTransactionTypes: FilterTransactionTypes;
};

interface WalletHistoryProps {
  user: ActiveAccount;
  ariaLabel?: string;
  token?: boolean;
}

const WalletHistory = ({
  transactions,
  activeAccountName,
  fetchAccountTransactions,
  user,
  token,
}: PropsFromRedux) => {
  const locale = getMainLocale();
  const [isFilterOpened, setIsFilterPanelOpened] = useState(false);
  let lastOperationFetched = -1;
  const [filter, setFilter] = useState<WalletHistoryFilter>(DEFAULT_FILTER);
  const [filterReady, setFilterReady] = useState<boolean>(false);

  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >(transactions.list);

  const [lastTransactionIndex, setLastTransactionIndex] = useState<number>(-1);

  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);

  const flatListRef = useRef();

  const [heightFlatList, setHeightFlatList] = useState(0);

  const [loading, setLoading] = useState(true);

  const [previousTransactionLength, setPreviousTransactionLength] = useState(0);

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
    if (value.trim() !== '') {
      const newFilter = {
        ...filter,
        filterValue: value,
      };
      updateFilter(newFilter);
    }
  };

  const updateFilter = (filter: any) => {
    setFilter(filter);
  };

  useEffect(() => {
    init();
  }, []);

  const finalizeDisplayedList = (list: Transaction[]) => {
    setDisplayedTransactions(list);
    setLoading(false);
  };

  const init = async () => {
    lastOperationFetched = await TransactionUtils.getLastTransaction(
      activeAccountName!,
    );
    setLoading(true);
    fetchAccountTransactions(activeAccountName!, lastOperationFetched);
    initFilters();
  };

  useEffect(() => {
    if (transactions && !transactions.loading) {
      setLoading(false);
    }
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
          activeAccountName!,
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
    const filter = await getFromKeychain(
      KeychainStorageKeyEnum.WALLET_HISTORY_FILTERS,
    );
    if (filter) {
      const newFilterFound = JSON.parse(filter) as WalletHistoryFilter;
      setFilter(newFilterFound);
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
    await saveOnKeychain(
      KeychainStorageKeyEnum.WALLET_HISTORY_FILTERS,
      JSON.stringify(filter),
    );
  };

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
                  (transaction as Transfer).to === activeAccountName) ||
                  (transaction.type === 'delegate_vesting_shares' &&
                    (transaction as Delegation).delegatee ===
                      activeAccountName))) ||
              (filter.outSelected &&
                ((TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
                  (transaction as Transfer).from === activeAccountName) ||
                  (transaction.type === 'delegate_vesting_shares' &&
                    (transaction as Delegation).delegator ===
                      activeAccountName)))
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
            activeAccountName!,
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
            activeAccountName!,
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
      setLoading(true);
      fetchAccountTransactions(
        activeAccountName!,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      );
    }
  };

  const clearFilters = () => {
    setFilter(DEFAULT_FILTER);
    handleScrollToTop();
  };

  const tryToLoadMore = () => {
    if (loading) return;
    setPreviousTransactionLength(displayedTransactions.length);
    setLoading(true);
    fetchAccountTransactions(
      activeAccountName!,
      Math.min(
        lastTransactionIndex,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      ),
    );
  };

  const handleScroll = (event: any) => {
    if (
      transactions.list[transactions.list.length - 1]?.last === true ||
      transactions.lastUsedStart === 0
    )
      return;
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY !== 0);
    if (innerScrollViewY >= heightFlatList - 400) {
      tryToLoadMore();
    }
  };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      setDisplayedScrollToTop(false);
      (flatListRef.current as FlatList).scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  };

  const handlePressedStyleFilterOperations = (filterOperationType: string) => {
    return filter.selectedTransactionTypes[filterOperationType]
      ? styles.pressedStyle
      : styles.touchableItem2;
  };

  const handlePressedStyleInOut = (inOutSelected: boolean) => {
    return inOutSelected ? styles.pressedStyle : styles.touchableItem;
  };

  return (
    <View style={styles.rootContainer}>
      <View aria-label="wallet-history-filter-panel">
        <View>
          <TouchableOpacity
            style={styles.filterToggler}
            onPress={() => toggleFilter()}>
            <Text style={styles.filterTogglerText}>Filter</Text>
          </TouchableOpacity>
        </View>
        {isFilterOpened && (
          <View style={styles.filtersContainer}>
            <View style={styles.searchPanel}>
              <CustomInput
                containerStyle={styles.customInputStyle}
                placeholder={translate('common.search_box_placeholder')}
                value={filter.filterValue}
                onChangeText={updateFilterValue}
              />
              <TouchableOpacity
                style={styles.touchableItem}
                aria-label="clear-filters"
                onPress={() => clearFilters()}>
                <Text>Clear Filters</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterSelectors}>
              <View style={styles.filterTypes}>
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
                        <Text>{filterOperationType}</Text>
                      </TouchableOpacity>
                    ),
                  )}
              </View>
              <View>
                <TouchableOpacity
                  style={handlePressedStyleInOut(filter.inSelected)}
                  aria-label="filter-by-incoming"
                  onPress={() => toggleFilterIn()}>
                  <Text>{'IN'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={handlePressedStyleInOut(filter.outSelected)}
                  aria-label="filter-by-outgoing"
                  onPress={() => toggleFilterOut()}>
                  <Text>{'OUT'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {!loading && (
        <View style={styles.flex} aria-label="wallet-item-list">
          <FlatList
            ref={flatListRef}
            data={displayedTransactions}
            initialNumToRender={20}
            onEndReachedThreshold={0.5}
            renderItem={(transaction) => {
              return (
                <WalletHistoryItemComponent
                  user={user}
                  locale={locale}
                  ariaLabel="wallet-history-item"
                  transaction={transaction.item}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Text
                  style={{
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: 20,
                  }}>
                  Nothing to show. Try another filter
                </Text>
              );
            }}
            keyExtractor={(transaction) =>
              addRandomToKeyString(transaction.key, 6)
            }
            style={styles.flex}
            onScroll={handleScroll}
            onContentSizeChange={(x: number, y: number) => setHeightFlatList(y)}
          />
          {transactions.list[transactions.list.length - 1]?.last === false &&
            transactions.lastUsedStart !== 0 &&
            !loading && (
              <View>
                <TouchableOpacity onPress={tryToLoadMore}>
                  <Text>Load More</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      )}

      {loading && (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Loader animating />
        </View>
      )}

      {displayScrollToTop && (
        <View style={styles.overlayButton}>
          <TouchableOpacity onPress={handleScrollToTop}>
            <Text style={styles.overlayButtonText}>{'TOP'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  flex: {flex: 1},
  searchPanel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  customInputStyle: {
    width: '60%',
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  filtersContainer: {
    flexDirection: 'column',
  },
  filterToggler: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9e6c6c',
    borderRadius: 5,
    margin: 8,
    opacity: 8,
    height: 30,
  },
  filterTogglerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  touchableItem: {
    borderColor: 'black',
    minWidth: '20%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableItem2: {
    borderColor: 'black',
    maxWidth: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSelectors: {
    flexDirection: 'row',
  },
  filterTypes: {
    width: '70%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  pressedStyle: {
    borderColor: '#946464',
    minWidth: '20%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    elevation: 8,
  },
  overlayButton: {
    justifyContent: 'center',
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'red',
    borderWidth: 1,
    width: 50,
    height: 30,
    opacity: 0.65,
  },
  overlayButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    transactions: state.transactions as Transactions,
    activeAccountName: state.activeAccount.name,
  };
};

const connector = connect(mapStateToProps, {
  fetchAccountTransactions,
  initAccountTransactions,
});
type PropsFromRedux = ConnectedProps<typeof connector> & WalletHistoryProps;

export const WalletHistoryComponent = connector(WalletHistory);
