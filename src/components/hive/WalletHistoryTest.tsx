import {fetchAccountTransactions} from 'actions/index';
import {ActiveAccount} from 'actions/interfaces';
import {clearWalletFilters, updateWalletFilter} from 'actions/walletFilters';
import Loader from 'components/ui/Loader';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Transaction, Transactions} from 'src/interfaces/transaction.interface';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {RootState} from 'store';
import ArrayUtils from 'utils/array.utils';
import {getMainLocale, translate} from 'utils/localize';
import TransactionUtils, {
  MINIMUM_FETCHED_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
} from 'utils/transactions.utils';
import {BackToTopButton} from './Back-To-Top-Button';
import WalletHistoryFilterPanel from './Wallet-history-filter-panel';
import WalletHistoryItemComponent from './WalletHistoryItemComponent';

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

interface WalletHistoryProps {
  user: ActiveAccount;
  ariaLabel?: string;
  token?: boolean;
}

type Props = WalletHistoryPropsFromRedux & WalletHistoryProps;

const WalletHistoryTest = ({
  transactions,
  walletFilters,
  fetchAccountTransactions,
  updateWalletFilter,
  clearWalletFilters,
  user,
}: Props) => {
  const [lastTransactionIndex, setLastTransactionIndex] = useState<number>(-1);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const flatListRef = useRef();
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >(transactions.list);
  const [previousTransactionLength, setPreviousTransactionLength] = useState(0);

  useEffect(() => {
    init();
  }, []);

  const finalizeDisplayedList = (list: Transaction[]) => {
    setDisplayedTransactions(list);
    setLoading(false);
  };

  const init = async () => {
    const lastOperationFetched = await TransactionUtils.getLastTransaction(
      user.account.name!,
    );
    console.log({lastOperationFetched}); //TODO to remove
    setLoading(true);
    fetchAccountTransactions(user.account.name!, lastOperationFetched);
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
          user.account.name!,
          transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
        );
      } else {
        //  so now the wallet-history-filter-panel
        //  will load automatically filterTransactions when received the fecthed data
        //  and filters are ready.
        const lastIndexFound = ArrayUtils.getMinValue(
          transactions.list,
          'index',
        );
        setLastTransactionIndex(lastIndexFound);
        console.log({lastIndexFound}); //TODO to remove
      }
    }
  }, [transactions]);

  const [loading, setLoading] = useState(true);
  const [end, setEnd] = useState(0);
  const locale = getMainLocale();

  const handleOnScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const renderTransactions = () => {
    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Loader animating />
        </View>
      );
    } else {
      return transactions.list.length ? (
        <>
          <FlatList
            ref={flatListRef}
            data={displayedTransactions}
            initialNumToRender={20}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              const newEnd =
                +transactions.list[transactions.list.length - 1].key.split(
                  '!',
                )[1] - 1;
              const isLastTransaction =
                transactions.list[transactions.list.length - 1].last;
              if (newEnd !== end && !isLastTransaction) {
                fetchAccountTransactions(user.account.name, newEnd);
                setEnd(newEnd);
              }
            }}
            renderItem={(transaction) => {
              return (
                <WalletHistoryItemComponent
                  transaction={transaction.item}
                  user={user}
                  locale={locale}
                />
              );
            }}
            onScroll={handleOnScroll}
            keyExtractor={(transaction) => transaction.key}
            style={basicStyles.flex}
            ListEmptyComponent={() => {
              return (
                <View>
                  <Text>
                    {translate('common.list_is_empty_try_clear_filter')}
                  </Text>
                </View>
              );
            }}
          />
        </>
      ) : (
        <Text style={basicStyles.no_tokens}>
          {translate('wallet.no_transaction')}
        </Text>
      );
    }
  };

  return (
    <View style={basicStyles.flex}>
      <WalletHistoryFilterPanel
        DEFAULT_FILTER={DEFAULT_FILTER}
        transactions={transactions}
        flatListRef={flatListRef}
        setDisplayedTransactions={setDisplayedTransactions}
        setPreviousTransactionLength={setPreviousTransactionLength}
        user={user}
        previousTransactionLength={previousTransactionLength}
        finalizeDisplayedList={finalizeDisplayedList}
        setLoading={setLoading}
        fetchAccountTransactions={fetchAccountTransactions}
        walletFilters={walletFilters}
        updateWalletFilter={updateWalletFilter}
        clearWalletFilters={clearWalletFilters}
      />
      {renderTransactions()}
      {displayScrollToTop && <BackToTopButton element={flatListRef} />}
    </View>
  );
};

const basicStyles = StyleSheet.create({
  flex: {flex: 1},
  no_tokens: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    marginVertical: 20,
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    transactions: state.transactions as Transactions,
    walletFilters: state.walletFilters,
  };
};
const connector = connect(mapStateToProps, {
  fetchAccountTransactions,
  updateWalletFilter,
  clearWalletFilters,
});
export type WalletHistoryPropsFromRedux = ConnectedProps<typeof connector>;
export default connector(WalletHistoryTest);
