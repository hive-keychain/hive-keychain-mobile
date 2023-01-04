import {ActiveAccount} from 'actions/interfaces';
import React from 'react';
import {View} from 'react-native';
import {Transaction} from 'src/interfaces/transaction.interface';
import {WalletTransactionInfoComponent} from './WalletTransactionInfoComponent';

interface WalletHistoryItemProps {
  user: ActiveAccount;
  transaction: Transaction;
  ariaLabel?: string;
  token?: boolean;
  locale: string;
}

const WalletHistoryItemComponent = ({
  transaction,
  ariaLabel,
  token,
  locale,
  user,
}: WalletHistoryItemProps) => {
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

export default WalletHistoryItemComponent;
