import {ActiveAccount} from 'actions/interfaces';
import React from 'react';
import {View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Transaction} from 'src/interfaces/transaction.interface';
import {RootState} from 'store';
import {WalletTransactionInfoComponent} from './WalletTransactionInfoComponent';

interface WalletHistoryItemProps {
  user: ActiveAccount;
  transaction: Transaction;
  ariaLabel?: string;
  token?: boolean;
  locale: string;
}

const WalletHistoryItem = ({
  transaction,
  ariaLabel,
  token,
  locale,
  user,
}: PropsFromRedux) => {
  return (
    <View style={{flex: 1}}>
      <WalletTransactionInfoComponent
        user={user}
        transaction={transaction}
        token={token}
        locale={locale}></WalletTransactionInfoComponent>
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector> & WalletHistoryItemProps;

export const WalletHistoryItemComponent = connector(WalletHistoryItem);
