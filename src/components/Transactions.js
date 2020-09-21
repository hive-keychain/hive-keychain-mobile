import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {initAccountTransactions} from 'actions';
import {connect} from 'react-redux';
import {withCommas} from 'utils/format';
import hive from 'utils/dhive';

const Transactions = ({transactions, initAccountTransactionsConnect, user}) => {
  useEffect(() => {
    initAccountTransactionsConnect(user.account.name);
  }, [user.account.name, initAccountTransactionsConnect]);

  return (
    <ScrollView>
      {transactions.map((transaction) => {
        return (
          <Transaction
            transaction={transaction}
            key={transaction.key}
            user={user}
          />
        );
      })}
    </ScrollView>
  );
};

const Transaction = ({transaction, user}) => {
  const [toggle, setToggle] = useState(false);
  const username = user.account.name;
  const {timestamp, from, to, amount, memo} = transaction;
  const other = from === username ? to : from;
  const direction = from === username ? '-' : '+';
  const color = direction === '+' ? '#3BB26E' : '#B9122F';
  const date = new Date(timestamp).toLocaleString([], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    color,
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={styles.left}>
          <Text>{date}</Text>
          <Text style={styles.username}>{`@${other}`}</Text>
        </View>

        <Text style={styles.amount}>{`${direction} ${withCommas(amount)} ${
          amount.split(' ')[1]
        }`}</Text>
      </View>
      {toggle && renderToggle(user, memo)}
    </TouchableOpacity>
  );
};

const renderToggle = (user, memo) => {
  let decryptedMemo = memo;
  if (!memo.length) {
    return null;
  }
  try {
    if (memo[0] === '#') {
      if (user.keys.memo) {
        decryptedMemo = hive.decodeMemo(user.keys.memo, memo);
      } else {
        decryptedMemo = 'Please add your memo key to decrypt this message.';
      }
    }
    return <Text>{decryptedMemo}</Text>;
  } catch (e) {
    console.log('Not really encrypted');
    return null;
  }
};

const getDimensionedStyles = ({width, height, color}) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderColor: 'black',
      padding: height * 0.01,
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    left: {display: 'flex', flexDirection: 'row'},
    username: {paddingLeft: 10},
    amount: {color},
  });

const mapStateToProps = (state) => {
  return {transactions: state.transactions};
};

export default connect(mapStateToProps, {
  initAccountTransactionsConnect: initAccountTransactions,
})(Transactions);
