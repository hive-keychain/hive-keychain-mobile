import {clearTokenHistory, loadTokenHistory} from 'actions/index';
import {BackToTopButton} from 'components/hive/Back-To-Top-Button';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {TokenTransaction} from 'src/interfaces/tokens.interface';
import {getColors} from 'src/styles/colors';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {TokenHistoryItemComponent} from './token-history-item';

export type TokenHistoryProps = {
  tokenBalance: string;
  tokenLogo: JSX.Element;
  currency: string;
  theme: Theme;
  filter?: WalletHistoryFilter; //TODO add &  use same filter types
};

//TODO important on histories & related pages: Add filter as the image in chat(the one used in wallet history, clickeable + float), notes bellow.
// I think we should adapt this on all histories yes (hive and hive engine)
// For Hive Engine, the filters would be different (stake /unstake instead of power up /down , no conversions or savings etc.)
// And filters change depending on ops possible on the current token

const TokensHistory = ({
  activeAccountName,
  currency,
  tokenHistory,
  theme,
  loadTokenHistory,
  clearTokenHistory,
  tokenLogo,
  filter,
}: TokenHistoryProps & PropsFromRedux) => {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    TokenTransaction[]
  >([]);
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const flatListRef = useRef();
  console.log({filter}); //TODO remove line
  useEffect(() => {
    setLoading(true);
    loadTokenHistory(activeAccountName!, currency);
    return () => {
      clearTokenHistory();
    };
  }, []);

  useEffect(() => {
    if (tokenHistory.length > 0 && filter) {
      const selectedTransactionTypes = Object.keys(
        filter.selectedTransactionTypes,
      ).filter((operation) => filter.selectedTransactionTypes[operation]);

      const filteredTokenHistory = tokenHistory.filter((item) => {
        //TODO clean up OLD WAY
        // return (
        //   (CURATIONS_REWARDS_TYPES.includes(item.operation) &&
        //     TokenTransactionUtils.filterCurationReward(
        //       item as CommentCurationTransaction,
        //       filterValue,
        //     )) ||
        //   (item.operation === OperationsHiveEngine.TOKENS_TRANSFER &&
        //     TokenTransactionUtils.filterTransfer(
        //       item as TransferTokenTransaction,
        //       filterValue,
        //     )) ||
        //   (item.operation === OperationsHiveEngine.TOKEN_STAKE &&
        //     TokenTransactionUtils.filterStake(
        //       item as StakeTokenTransaction,
        //       filterValue,
        //     )) ||
        //   (item.operation === OperationsHiveEngine.MINING_LOTTERY &&
        //     TokenTransactionUtils.filterMiningLottery(
        //       item as MiningLotteryTransaction,
        //       filterValue,
        //     )) ||
        //   (item.operation === OperationsHiveEngine.TOKENS_DELEGATE &&
        //     TokenTransactionUtils.filterDelegation(
        //       item as DelegationTokenTransaction,
        //       filterValue,
        //     )) ||
        //   item.amount.toLowerCase().includes(filterValue.toLowerCase()) ||
        //   item.operation.toLowerCase().includes(filterValue.toLowerCase()) ||
        //   (item.timestamp &&
        //     moment(item.timestamp)
        //       .format('L')
        //       .includes(filterValue.toLowerCase()))
        // );
        //END OLD WAY

        //TODO CHECK NEW WAY
        //TODO keep working on this...
        return (
          selectedTransactionTypes.includes(item.operation) ||
          selectedTransactionTypes.length === 0
        );
        //END NEW WAY
      });
      console.log({l: filteredTokenHistory.length}); //TODO remove line
      setDisplayedTransactions(filteredTokenHistory);
      setLoading(false);
    }
  }, [tokenHistory, filter]);

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const styles = getStyles(theme);

  const renderItem = (transaction: TokenTransaction) => {
    return (
      <TokenHistoryItemComponent
        theme={theme}
        transaction={transaction}
        useIcon={true}
      />
    );
  };

  return (
    <View style={styles.flex}>
      <View style={styles.container}>
        {/* //TODO bellow cleanup */}
        {/* <Separator />
        <ClearableInput
          loading={loading}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        /> */}
        <Separator />
        <FlatList
          ref={flatListRef}
          data={displayedTransactions}
          renderItem={(transaction) => renderItem(transaction.item)}
          keyExtractor={(transaction) => transaction._id}
          onScroll={handleScroll}
          style={styles.listContainer}
        />
        <Separator />
      </View>

      {!loading &&
        tokenHistory.length > 0 &&
        displayedTransactions.length === 0 && (
          <View style={[styles.flex, styles.verticallyCentered]}>
            <Text style={styles.textBold}>
              {translate('wallet.operations.history.no_transaction_or_clear')}
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
        <BackToTopButton element={flatListRef} theme={theme} />
      )}
      {/* END ScrollToTop Button */}
    </View>
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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
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
      //TODO cleanup & adjust
      // maxHeight: 500,
      // padding: 25,
    },
    listContainer: {
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingTop: 25,
      paddingHorizontal: 25,
      backgroundColor: getColors(theme).secondaryCardBgColor,
    },
  });

export const TokensHistoryComponent = connector(TokensHistory);
