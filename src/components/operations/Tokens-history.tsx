import {clearTokenHistory, loadTokenHistory} from 'actions/index';
import Loader from 'components/ui/Loader';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {
  CommentCurationTransaction,
  CURATIONS_REWARDS_TYPES,
  DelegationTokenTransaction,
  MiningLotteryTransaction,
  OperationsHiveEngine,
  StakeTokenTransaction,
  TokenTransaction,
  TransferTokenTransaction,
} from 'src/interfaces/tokens.interface';
import {RootState} from 'store';
import {TokenTransactionUtils} from 'utils/token-transaction.utils';
import {HistoryProps} from './History';
import {TokenHistoryItemComponent} from './token-history-item';

//TODO add fecthing logic same as used in complete-history:
//  TODO add src\popup\actions\token.actions.ts

const TokensHistory = ({
  activeAccountName,
  // currentTokenBalance,
  currency,
  tokenHistory,
  loadTokenHistory,
  clearTokenHistory,
}: // setTitleContainerProperties,
HistoryProps & PropsFromRedux) => {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    TokenTransaction[]
  >([]);

  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadTokenHistory(activeAccountName!, currency);
    return () => {
      clearTokenHistory();
    };
  }, []);

  useEffect(() => {
    console.log({thL: tokenHistory.length, dL: displayedTransactions.length});
    setDisplayedTransactions(
      tokenHistory.filter((item) => {
        return (
          (CURATIONS_REWARDS_TYPES.includes(item.operation) &&
            TokenTransactionUtils.filterCurationReward(
              item as CommentCurationTransaction,
              filterValue,
            )) ||
          (item.operation === OperationsHiveEngine.TOKENS_TRANSFER &&
            TokenTransactionUtils.filterTransfer(
              item as TransferTokenTransaction,
              filterValue,
            )) ||
          (item.operation === OperationsHiveEngine.TOKEN_STAKE &&
            TokenTransactionUtils.filterStake(
              item as StakeTokenTransaction,
              filterValue,
            )) ||
          (item.operation === OperationsHiveEngine.MINING_LOTTERY &&
            TokenTransactionUtils.filterMiningLottery(
              item as MiningLotteryTransaction,
              filterValue,
            )) ||
          (item.operation === OperationsHiveEngine.TOKENS_DELEGATE &&
            TokenTransactionUtils.filterDelegation(
              item as DelegationTokenTransaction,
              filterValue,
            )) ||
          item.amount.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.operation.toLowerCase().includes(filterValue.toLowerCase()) ||
          (item.timestamp &&
            moment(item.timestamp)
              .format('L')
              .includes(filterValue.toLowerCase()))
        );
      }),
    );
    setLoading(false);
  }, [tokenHistory, filterValue]);

  //   useEffect(() => {
  //     console.log({l: displayedTransactions.length}); //TODO to remove
  //     if (displayedTransactions.length !== 0) {
  //       setLoading(false);
  //     } else {
  //       setLoading(true);
  //     }
  //   }, [displayedTransactions]);

  const renderItem = (transaction: TokenTransaction) => {
    return <TokenHistoryItemComponent transaction={transaction} />;
  };

  return (
    <View style={styles.flex}>
      {/* //TODO filter */}
      {/* <InputComponent
          ariaLabel="input-filter-box"
          type={InputType.TEXT}
          placeholder="popup_html_search"
          value={filterValue}
          onChange={setFilterValue}
        /> */}
      {!loading && displayedTransactions.length > 0 && (
        <View style={{maxHeight: 400}}>
          <FlatList
            data={displayedTransactions}
            renderItem={(transaction) => renderItem(transaction.item)}
            keyExtractor={(transaction) => transaction._id}
          />
        </View>
      )}
      {!loading && displayedTransactions.length === 0 && (
        <Text>No transactions on this token yet!</Text>
      )}
      {loading && (
        <View style={[styles.flex, styles.verticallyCentered]}>
          <Loader animating={true} />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccountName: state.activeAccount?.name,
    userTokens: state.userTokens,
    //   currentTokenBalance: state.navigation.params?.tokenBalance as TokenBalance,
    tokenHistory: state.tokenHistory as TokenTransaction[],
  };
};

const connector = connect(mapStateToProps, {
  loadTokenHistory,
  clearTokenHistory,
  // setTitleContainerProperties,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  verticallyCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const TokensHistoryComponent = connector(TokensHistory);
function dispatch(arg0: {type: any}) {
  throw new Error('Function not implemented.');
}
