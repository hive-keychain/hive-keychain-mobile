import {fetchAccountTransactions, initAccountTransactions} from 'actions/index';
import {ActiveAccount} from 'actions/interfaces';
import Loader from 'components/ui/Loader';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import {getMainLocale, translate} from 'utils/localize';
import WalletHistoryItemComponent from './WalletHistoryItemComponent';

type Props = PropsFromRedux & {user: ActiveAccount};

const Transactions = ({
  transactions,
  loading,
  initAccountTransactions,
  fetchAccountTransactions,
  user,
}: Props) => {
  useEffect(() => {
    if (user.account.name) {
      initAccountTransactions(user.account.name);
    }
  }, [user.account.name, initAccountTransactions]);

  // const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
  // const toggleFilter = () => {
  //   setIsFilterPanelOpened(!isFilterPanelOpened);
  // };

  const [end, setEnd] = useState(0);
  const locale = getMainLocale();
  const {theme} = useThemeContext();
  const renderTransactionItem = useCallback(
    ({item}) => (
      <WalletHistoryItemComponent
        theme={theme}
        transaction={item}
        user={user}
        locale={locale}
      />
    ),
    [theme, user, locale],
  );

  const renderTransactions = () => {
    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Loader animating />
        </View>
      );
    } else {
      return transactions.length ? (
        <>
          <FlatList
            data={transactions}
            initialNumToRender={20}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              const newEnd =
                +transactions[transactions.length - 1].key.split('!')[1] - 1;
              if (
                newEnd !== end &&
                !transactions[transactions.length - 1].last
              ) {
                fetchAccountTransactions(user.account.name, newEnd);
                setEnd(newEnd);
              }
            }}
            renderItem={renderTransactionItem}
            keyExtractor={(transaction) => transaction.key}
            style={basicStyles.flex}
          />
        </>
      ) : (
        <Text style={basicStyles.no_tokens}>
          {translate('wallet.no_transaction')}
        </Text>
      );
    }
  };

  return <View style={basicStyles.flex}>{renderTransactions()}</View>;
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
    transactions: state.transactions.list,
    loading: state.transactions.loading,
  };
};
const connector = connect(mapStateToProps, {
  initAccountTransactions,
  fetchAccountTransactions,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Transactions);
