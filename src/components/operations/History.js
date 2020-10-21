import React, {useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {connect} from 'react-redux';

import Operation from './Operation';
import {translate} from 'utils/localize';
import Separator from 'components/ui/Separator';
import {loadTokenHistory} from 'actions';
import HistoryIcon from 'assets/wallet/icon_history_green.svg';
import Balance from './Balance';
import Transfer from 'components/hive/Transfer';

const History = ({
  user,
  tokenBalance,
  tokenLogo,
  currency,
  history,
  loadTokenHistoryConnect,
}) => {
  useEffect(() => {
    if (user.name) {
      loadTokenHistoryConnect(user.name, currency);
    }
  }, [loadTokenHistoryConnect, user.name, currency]);

  const styles = getDimensionedStyles();

  return (
    <Operation
      logo={<HistoryIcon />}
      title={translate('wallet.operations.history')}>
      <Separator height={40} />
      <Balance
        currency={currency}
        tokenBalance={tokenBalance}
        tokenLogo={tokenLogo}
        engine
      />
      <Separator />
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => {
          return <Transfer transaction={item} user={user} />;
        }}
      />
    </Operation>
  );
};

const getDimensionedStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
    },
    text: {fontSize: 16},
    rightContainer: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
    },
    logo: {marginLeft: 20, height: 16, width: 16},
    separator: {marginVertical: 5, borderBottomWidth: 1},
  });

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      history: state.tokenHistory,
    };
  },
  {
    loadTokenHistoryConnect: loadTokenHistory,
  },
)(History);
