import {ActiveAccount} from 'actions/interfaces';
import React from 'react';
import {View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Transaction} from 'src/interfaces/transaction.interface';
import {WalletTransactionInfoComponent} from './WalletTransactionInfoComponent';

interface WalletHistoryItemProps {
  user: ActiveAccount;
  transaction: Transaction;
  locale: string;
  theme: Theme;
  ariaLabel?: string;
  token?: boolean;
}

const WalletHistoryItemComponent = ({
  transaction,
  ariaLabel,
  token,
  locale,
  user,
  theme,
}: WalletHistoryItemProps) => {
  return (
    <View style={{flex: 1}}>
      <WalletTransactionInfoComponent
        user={user}
        transaction={transaction}
        token={token}
        locale={locale}
        theme={theme}
      />
    </View>
  );
};

export default WalletHistoryItemComponent;
