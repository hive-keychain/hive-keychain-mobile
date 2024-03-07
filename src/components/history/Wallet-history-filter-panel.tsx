import {ActionPayload, ActiveAccount} from 'actions/interfaces';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icons} from 'src/enums/icons.enums';
import {Transaction, Transactions} from 'src/interfaces/transaction.interface';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {translate} from 'utils/localize';
import {
  MINIMUM_FETCHED_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
} from 'utils/transactions.utils';
import {WalletHistoryUtils} from 'utils/walletHistoryUtils';
import Icon from '../hive/Icon';

interface WalletHistoryFilterPanelProps {
  DEFAULT_WALLET_FILTER: WalletHistoryFilter;
  transactions: Transactions;
  flatListRef: React.MutableRefObject<FlatList>;
  setDisplayedTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setPreviousTransactionLength: React.Dispatch<React.SetStateAction<number>>;
  activeAccount: ActiveAccount;
  previousTransactionLength: number;
  finalizeDisplayedList: (list: Transaction[]) => void;
  fetchAccountTransactions: (accountName: string, start: number) => void;
  walletFilters: WalletHistoryFilter;
  updateWalletFilter: (
    walletFilters: WalletHistoryFilter,
  ) => ActionPayload<WalletHistoryFilter>;
  clearWalletFilters: () => ActionPayload<WalletHistoryFilter>;
  setBottomLoader: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  isFilterOpened: boolean;
  toggleFilter: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  displayedTransactions: Transaction[];
}

const WalletHistoryFilterPanel = forwardRef(
  (props: WalletHistoryFilterPanelProps, ref) => {
    const [filter, setFilter] = useState<WalletHistoryFilter>(
      props.walletFilters,
    );
    const [filterReady, setFilterReady] = useState<boolean>(false);

    useEffect(() => {
      props.setPreviousTransactionLength(0);
      if (filterReady) {
        if (props.displayedTransactions.length > 0) {
          const checkOnDisplayedTransactions = WalletHistoryUtils.applyAllFilters(
            props.displayedTransactions,
            filter,
            props.activeAccount,
          );
          if (checkOnDisplayedTransactions.length === 0) props.setLoading(true);
        }
        filterTransactions();
        saveFilterInLocalStorage();
      }
    }, [filter]);

    useImperativeHandle(ref, () => ({
      filterNow: () => {
        filterTransactions();
      },
      initFiltersNow: () => {
        initFilters();
      },
      forceResetFilters: () => {
        clearFilters();
      },
    }));

    const toggleFilterType = (transactionName: string) => {
      const newFilter = {...filter.selectedTransactionTypes};
      newFilter[transactionName] = !filter.selectedTransactionTypes[
        transactionName
      ];
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

    const updateFilter = (filter: WalletHistoryFilter) => {
      setFilter(filter);
    };

    const initFilters = async () => {
      setFilter(props.walletFilters);
      setFilterReady(true);
    };

    useEffect(() => {
      props.setPreviousTransactionLength(0);
      if (filterReady) {
        filterTransactions();
        saveFilterInLocalStorage();
      }
    }, [filter]);

    const saveFilterInLocalStorage = async () => {
      props.updateWalletFilter(filter);
    };

    const filterTransactions = () => {
      let filteredTransactions = WalletHistoryUtils.applyAllFilters(
        props.transactions.list,
        filter,
        props.activeAccount,
      );

      if (
        (filteredTransactions.length >= MINIMUM_FETCHED_TRANSACTIONS &&
          filteredTransactions.length >= props.previousTransactionLength + 1) ||
        props.transactions.list.some((t) => t.last) ||
        props.transactions.lastUsedStart === 0
      ) {
        props.finalizeDisplayedList(filteredTransactions);
      } else {
        props.setBottomLoader(true);
        props.fetchAccountTransactions(
          props.activeAccount.name!,
          props.transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
        );
      }
    };

    const clearFilters = () => {
      props.updateWalletFilter(props.DEFAULT_WALLET_FILTER);
      setFilter(props.DEFAULT_WALLET_FILTER);
    };

    const handlePressedStyleFilterOperations = (
      filterOperationType: string,
    ) => {
      return filter.selectedTransactionTypes[filterOperationType]
        ? [styles.filterButton, styles.filterButtonPressed]
        : styles.filterButton;
    };

    const handlePressedStyleFilterButtonText = (
      filterOperationType: string,
    ) => {
      return filter.selectedTransactionTypes[filterOperationType]
        ? styles.filterButtonTextPressed
        : styles.filterButtonText;
    };

    const handlePressedStyleInOut = (inOutSelected: boolean) => {
      return inOutSelected
        ? [styles.inOutItem, styles.inOutPressedItem]
        : styles.inOutItem;
    };

    const handlePressedStyleInOutText = (inOutSelected: boolean) => {
      return inOutSelected
        ? [styles.inOutItemText, styles.inOutItemPressedText]
        : styles.inOutItemText;
    };

    return !props.loading ? (
      <View aria-label="wallet-history-filter-panel">
        <View style={styles.filterTogglerContainer}>
          <View style={styles.filterTogglerInnerContainer}>
            <Text style={styles.filterTitleText}>
              {translate('wallet.filter.filters_title')}
            </Text>
            <TouchableOpacity
              style={styles.filterIconContainer}
              onPress={() => props.toggleFilter()}>
              {props.isFilterOpened ? (
                <Icon name={Icons.EXPAND_LESS} marginRight={false} />
              ) : (
                <Icon name={Icons.EXPAND_MORE} marginRight={false} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {props.isFilterOpened && (
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
                        <Text
                          style={handlePressedStyleFilterButtonText(
                            filterOperationType,
                          )}>
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
                  <Text style={handlePressedStyleInOutText(filter.inSelected)}>
                    {translate('wallet.filter.filter_in')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={handlePressedStyleInOut(filter.outSelected)}
                  aria-label="filter-by-outgoing"
                  onPress={() => toggleFilterOut()}>
                  <Text style={handlePressedStyleInOutText(filter.outSelected)}>
                    {translate('wallet.filter.filter_out')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    ) : null;
  },
);

const styles = StyleSheet.create({
  flex: {flex: 1},
  filtersContainer: {
    flexDirection: 'column',
  },
  filterTogglerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  filterTogglerInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  filterIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
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
  inOutItemText: {
    color: 'black',
  },
  inOutPressedItem: {
    borderColor: '#68A0B4',
    backgroundColor: '#68A0B4',
  },
  inOutItemPressedText: {
    color: 'white',
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
  filterButton: {
    width: '45%',
    margin: 4,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderColor: 'black',
  },
  filterButtonText: {
    color: 'black',
  },
  filterButtonPressed: {
    borderColor: '#68A0B4',
    backgroundColor: '#68A0B4',
  },
  filterButtonTextPressed: {
    color: 'white',
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
});

export default WalletHistoryFilterPanel;
