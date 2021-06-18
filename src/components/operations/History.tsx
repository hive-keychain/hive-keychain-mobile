import {loadTokenHistory} from 'actions/index';
import HistoryIcon from 'assets/wallet/icon_history_green.svg';
import Transfer from 'components/hive/Transfer';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import Balance from './Balance';
import Operation from './Operation';

export type HistoryProps = {
  tokenBalance: string;
  tokenLogo: JSX.Element;
  currency: string;
};
type Props = PropsFromRedux & HistoryProps;
const History = ({
  user,
  tokenBalance,
  tokenLogo,
  currency,
  history,
  loadTokenHistory,
}: Props) => {
  useEffect(() => {
    if (user.name) {
      loadTokenHistory(user.name, currency);
    }
  }, [loadTokenHistory, user.name, currency]);

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
          return <Transfer transaction={item} user={user} token />;
        }}
      />
    </Operation>
  );
};
const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      history: state.tokenHistory,
    };
  },
  {
    loadTokenHistory,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(History);
