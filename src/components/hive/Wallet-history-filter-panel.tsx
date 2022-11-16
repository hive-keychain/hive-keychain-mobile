import AsyncStorage from '@react-native-community/async-storage';
import {ActiveAccount} from 'actions/interfaces';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {translate} from 'utils/localize';
import {
  HAS_IN_OUT_TRANSACTIONS,
  MINIMUM_FETCHED_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
  TRANSFER_TYPE_TRANSACTIONS,
} from 'utils/transactions.utils';
import {WalletHistoryUtils} from 'utils/walletHistoryUtils';
import Icon from './Icon';

interface WalletHistoryFilterPanelProps {
  DEFAULT_FILTER: WalletHistoryFilter;
  transactions: Transactions;
  flatListRef: any; //TODO add type
  setDisplayedTransactions: any; //TODO add type
  setPreviousTransactionLength: any; //TODO add type
  user: ActiveAccount;
  previousTransactionLength: number;
  finalizeDisplayedList: any; //TODO add type
  setLoading: any; //TODO add type
  fetchAccountTransactions: any; //TODO add type
}

type Props = WalletHistoryFilterPanelProps;

const WalletHistoryFilterPanel = ({
  DEFAULT_FILTER,
  transactions,
  flatListRef,
  setDisplayedTransactions,
  setPreviousTransactionLength,
  user,
  previousTransactionLength,
  finalizeDisplayedList,
  setLoading,
  fetchAccountTransactions,
}: Props) => {
  const [filter, setFilter] = useState<WalletHistoryFilter>(DEFAULT_FILTER);
  const [filterReady, setFilterReady] = useState<boolean>(false);
  const [isFilterOpened, setIsFilterPanelOpened] = useState(false);

  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    setPreviousTransactionLength(0);
    if (filterReady && transactions.list.length) {
      filterTransactions();
      saveFilterInLocalStorage();
    }
  }, [filter, transactions]);

  const saveFilterInLocalStorage = async () => {
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.WALLET_HISTORY_FILTERS,
      JSON.stringify(filter),
    );
  };

  const initFilters = async () => {
    const filter = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.WALLET_HISTORY_FILTERS,
    );

    if (filter) {
      const newFilterFound = JSON.parse(filter) as WalletHistoryFilter;
      setFilter(newFilterFound);
    }
    setFilterReady(true);
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

  const toggleFilter = () => {
    setIsFilterPanelOpened(!isFilterOpened);
  };

  const clearFilters = () => {
    setFilter(DEFAULT_FILTER);
    if (flatListRef && flatListRef.current && transactions.list.length > 0) {
      flatListRef.current.scrollToIndex({animated: false, index: 0});
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
                  (transaction as Transfer).to === user.account.name) ||
                  (transaction.type === 'delegate_vesting_shares' &&
                    (transaction as Delegation).delegatee ===
                      user.account.name))) ||
              (filter.outSelected &&
                ((TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
                  (transaction as Transfer).from === user.account.name) ||
                  (transaction.type === 'delegate_vesting_shares' &&
                    (transaction as Delegation).delegator ===
                      user.account.name)))
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
            user.account.name!,
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
            user.account.name!,
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
        user.account.name!,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      );
    }
  };

  return (
    <View aria-label="wallet-history-filter-panel">
      <View style={styles.filterTogglerContainer}>
        <View style={styles.filterTogglerInnerContainer}>
          <Text>Filter</Text>
          <TouchableOpacity
            style={styles.circularContainer}
            onPress={() => toggleFilter()}>
            {isFilterOpened ? (
              <Icon name={Icons.EXPAND_LESS} />
            ) : (
              <Icon name={Icons.EXPAND_MORE} />
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
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 100,
    margin: 8,
    opacity: 8,
    height: 30,
    width: 30,
  },
  filterTogglerText: {
    color: 'black',
    fontWeight: 'bold',
  },
  touchableItem: {
    borderColor: 'black',
    minWidth: '20%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableItem2: {
    borderColor: 'black',
    maxWidth: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTypes: {
    width: '70%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  pressedStyle: {
    borderColor: 'black',
    maxWidth: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b89f9f',
  },
  customInputStyle: {
    width: '60%',
    height: 40,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: '#dbd6d6',
    marginLeft: 4,
  },
  searchPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WalletHistoryFilterPanel;
