import {clearUserTransactions, fetchAccountTransactions} from 'actions/index';
import {clearWalletFilters, updateWalletFilter} from 'actions/walletFilters';
import Loader from 'components/ui/Loader';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {DEFAULT_WALLET_FILTER} from 'reducers/walletFilters';
import {Transaction, Transactions} from 'src/interfaces/transaction.interface';
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
interface WalletHistoryProps {
  // user: ActiveAccount;
  ariaLabel?: string;
  token?: boolean;
}

type Props = WalletHistoryPropsFromRedux & WalletHistoryProps;

const WalletHistoryComponent = ({
  transactions,
  walletFilters,
  fetchAccountTransactions,
  updateWalletFilter,
  clearWalletFilters,
  clearUserTransactions,
  user,
}: Props) => {
  const [lastTransactionIndex, setLastTransactionIndex] = useState<number>(-1);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const flatListRef = useRef();
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >(transactions.list);
  const [previousTransactionLength, setPreviousTransactionLength] = useState(0);
  const [bottomLoader, setBottomLoader] = useState(false);

  let lastOperationFetched = -1;

  useEffect(() => {
    if (user.name) {
      console.log('First setLoading'); //TODO to remove
      setLoading(true);
      setDisplayedScrollToTop(false);
      init();
    }
  }, [user.name]);

  const finalizeDisplayedList = (list: Transaction[]) => {
    setDisplayedTransactions(list);
    setLoading(false);
    setBottomLoader(false);
  };

  const init = async () => {
    clearUserTransactions();
    lastOperationFetched = await TransactionUtils.getLastTransaction(
      user.name!,
    );
    fetchAccountTransactions(user.name!, lastOperationFetched);
  };

  useEffect(() => {
    console.log({
      important: {
        lastUsedStart: transactions.lastUsedStart,
        listLenght: transactions.list.length,
        loading: loading,
        isThereAtLeastOneWithlast: transactions.list.some((t) => t.last),
        displayedTransactionsLenght: displayedTransactions.length,
      },
    }); //TODO to remove
    if (transactions.lastUsedStart !== -1) {
      if (
        transactions.list.length < MINIMUM_FETCHED_TRANSACTIONS &&
        !transactions.list.some((t) => t.last)
      ) {
        if (transactions.lastUsedStart === 1) {
          setLoading(false);
          return;
        }
        console.log('consecutives setLoading'); //TODO to remove
        setLoading(true);
        fetchAccountTransactions(
          user.name!,
          transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
        );
      } else {
        const lastIndexFound = ArrayUtils.getMinValue(
          transactions.list,
          'index',
        );
        console.log({lastIndexFound}); //TODO to remove
        setLastTransactionIndex(lastIndexFound);
      }
    }
  }, [transactions]);

  const [loading, setLoading] = useState(true);
  const [showLoadMore, setshowLoadMore] = useState(false);

  const locale = getMainLocale();

  const handleOnScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const tryToLoadMore = () => {
    //changing condition to
    // if (displayedTransactions.length >= 1) {
    //   setLoading(false);
    // } else {
    //   setLoading(true);
    //   return;
    // }
    //end changing

    if (loading) return;
    setPreviousTransactionLength(displayedTransactions.length);
    setBottomLoader(true);
    fetchAccountTransactions(
      user.name!,
      Math.min(
        lastTransactionIndex,
        transactions.lastUsedStart - NB_TRANSACTION_FETCHED,
      ),
    );
  };

  const renderTransactions = () => {
    if (loading) {
      return (
        <View style={basicStyles.renderTransactions}>
          <Loader animating />
        </View>
      );
    } else {
      return displayedTransactions.length > 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            data={displayedTransactions}
            initialNumToRender={20}
            onEndReachedThreshold={0.5}
            // onEndReached={() => {
            //   const isLastFetched =
            //     transactions.list[transactions.list.length - 1].lastFetched;
            //   console.log({
            //     isLastFetched,
            //     loading,
            //     displayedTransactionsLenght: displayedTransactions.length,
            //   });
            //   // setshowLoadMore(!isLastFetched);
            //   if (!isLastFetched) {
            //     tryToLoadMore();
            //   }
            // }}
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
            style={basicStyles.transactionsList}
            ListEmptyComponent={() => {
              return (
                <View
                  style={[
                    basicStyles.flex,
                    basicStyles.justifyAlignedCenteredFixedHeight,
                  ]}>
                  <Text>
                    {translate('common.list_is_empty_try_clear_filter')}
                  </Text>
                </View>
              );
            }}
          />
          {bottomLoader && displayedTransactions.length >= 0 && (
            <View style={basicStyles.centeredContainer}>
              <Loader animating size={'small'} />
            </View>
          )}
          {/* testing loadmorebutton */}
          {/* {showLoadMore && !bottomLoader && (
            <View style={basicStyles.centeredContainer}>
              <TouchableOpacity
                style={basicStyles.borderedRoundContainer}
                onPress={() => tryToLoadMore()}>
                <Text>load more</Text>
              </TouchableOpacity>
            </View>
          )} */}
          {/* end testing */}
        </>
      ) : (
        <Text style={basicStyles.no_tokens}>
          {!transactions.loading && translate('wallet.no_transaction')}
        </Text>
      );
    }
  };

  return (
    <View style={basicStyles.flex}>
      <WalletHistoryFilterPanel
        DEFAULT_WALLET_FILTER={DEFAULT_WALLET_FILTER}
        transactions={transactions}
        flatListRef={flatListRef}
        setDisplayedTransactions={setDisplayedTransactions}
        setPreviousTransactionLength={setPreviousTransactionLength}
        user={user}
        previousTransactionLength={previousTransactionLength}
        finalizeDisplayedList={finalizeDisplayedList}
        setLoading={setLoading}
        loading={loading}
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
  justifyAlignedCenteredFixedHeight: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  no_tokens: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    marginVertical: 20,
  },
  renderTransactions: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionsList: {
    marginBottom: 33,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  borderedRoundContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    transactions: state.transactions as Transactions,
    walletFilters: state.walletFilters,
    user: state.activeAccount,
  };
};
const connector = connect(mapStateToProps, {
  fetchAccountTransactions,
  updateWalletFilter,
  clearWalletFilters,
  clearUserTransactions,
});
type WalletHistoryPropsFromRedux = ConnectedProps<typeof connector>;
export default connector(WalletHistoryComponent);
