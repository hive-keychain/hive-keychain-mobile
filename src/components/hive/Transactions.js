import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {initAccountTransactions, fetchAccountTransactions} from 'actions';
import {connect} from 'react-redux';
import {translate} from 'utils/localize';
import Transfer from './Transfer';
import Loader from 'components/ui/Loader';

const Transactions = ({
  transactions,
  loading,
  initAccountTransactionsConnect,
  fetchAccountTransactionsConnect,
  user,
}) => {
  useEffect(() => {
    if (user.account.name) {
      initAccountTransactionsConnect(user.account.name);
    }
  }, [user.account.name, initAccountTransactionsConnect]);
  const [end, setEnd] = useState(0);

  const renderTransactions = () => {
    if (loading) {
      return <Loader animating />;
    } else {
      return transactions.length ? (
        <FlatList
          data={transactions}
          initialNumToRender={20}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            console.log('end reached');
            const newEnd =
              transactions[transactions.length - 1].key.split('!')[1] - 1;
            if (newEnd !== end && !transactions[transactions.length - 1].last) {
              fetchAccountTransactionsConnect(user.account.name, newEnd);
              setEnd(newEnd);
            }
          }}
          renderItem={(transaction) => {
            return <Transfer transaction={transaction.item} user={user} />;
          }}
          keyExtractor={(transaction) => transaction.key}
          style={basicStyles.flex}
        />
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

const mapStateToProps = (state) => {
  return {
    transactions: state.transactions.list,
    loading: state.transactions.loading,
  };
};

export default connect(mapStateToProps, {
  initAccountTransactionsConnect: initAccountTransactions,
  fetchAccountTransactionsConnect: fetchAccountTransactions,
})(Transactions);
