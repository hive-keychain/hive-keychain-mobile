import {clearTokenHistory, loadTokenHistory} from 'actions/index';
import {BackToTopButton} from 'components/hive/Back-To-Top-Button';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
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
import {translate} from 'utils/localize';
import {TokenTransactionUtils} from 'utils/token-transaction.utils';
import ClearableInput from '../form/ClearableInput';
import Operation from './Operation';
import {TokenHistoryItemComponent} from './token-history-item';

export type TokenHistoryProps = {
  tokenBalance: string;
  tokenLogo: JSX.Element;
  currency: string;
};

const TokensHistory = ({
  activeAccountName,
  currency,
  tokenHistory,
  loadTokenHistory,
  clearTokenHistory,
  tokenLogo,
}: TokenHistoryProps & PropsFromRedux) => {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    TokenTransaction[]
  >([]);

  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    setLoading(true);
    loadTokenHistory(activeAccountName!, currency);
    return () => {
      clearTokenHistory();
    };
  }, []);

  useEffect(() => {
    if (tokenHistory.length > 0) {
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
    }
  }, [tokenHistory, filterValue]);

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const renderItem = (transaction: TokenTransaction) => {
    return (
      <TokenHistoryItemComponent transaction={transaction} useIcon={true} />
    );
  };

  return (
    <Operation
      title={`${currency} ${translate('common.history').toUpperCase()}`}
      logo={tokenLogo}>
      <>
        <View style={styles.flex}>
          <View style={styles.container}>
            <Separator />
            <ClearableInput
              loading={loading}
              filterValue={filterValue}
              setFilterValue={setFilterValue}
            />
            <Separator />
            <FlatList
              ref={flatListRef}
              data={displayedTransactions}
              renderItem={(transaction) => renderItem(transaction.item)}
              keyExtractor={(transaction) => transaction._id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onScroll={handleScroll}
            />
          </View>

          {!loading &&
            tokenHistory.length > 0 &&
            displayedTransactions.length === 0 && (
              <View style={[styles.flex, styles.verticallyCentered]}>
                <Text style={styles.textBold}>
                  {translate('common.no_transaction_or_clear')}
                </Text>
              </View>
            )}
          {loading && (
            <View style={[styles.flex, styles.verticallyCentered]}>
              <Loader animating={true} />
            </View>
          )}

          {/* ScrollToTop Button */}
          {!loading && displayScrollToTop && (
            <BackToTopButton element={flatListRef} />
          )}
          {/* END ScrollToTop Button */}
        </View>
      </>
    </Operation>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccountName: state.activeAccount?.name,
    userTokens: state.userTokens,
    tokenHistory: state.tokenHistory as TokenTransaction[],
  };
};

const connector = connect(mapStateToProps, {
  loadTokenHistory,
  clearTokenHistory,
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
  separator: {marginVertical: 3, borderBottomWidth: 1},
  logo: {justifyContent: 'center', alignItems: 'center'},
  rowContainer: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  marginBottom: {
    marginBottom: 5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  container: {
    maxHeight: 500,
    marginBottom: 30,
  },
});

export const TokensHistoryComponent = connector(TokensHistory);
