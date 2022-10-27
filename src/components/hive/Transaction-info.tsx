import {ActiveAccount, Transaction} from 'actions/interfaces';
import React from 'react';
import {View} from 'react-native';
import FillRecurrentTransfer from './Fill-recurrent-transfer';
import RecurrentTransfer from './Recurrent-transfer';
import Transfer from './Transfer';

type Props = {
  user: ActiveAccount;
  transaction: Transaction;
  token?: boolean;
  locale: string;
};

const TransactionInfo = ({transaction, user, locale, token = false}: Props) => {
  const getTransactionContent = () => {
    switch (transaction.type) {
      case 'transfer':
        return (
          <Transfer transaction={transaction} user={user} locale={locale} />
        );

      case 'recurrent_transfer':
        return (
          <RecurrentTransfer
            transaction={transaction}
            user={user}
            locale={locale}
          />
        );

      //TODO work on rest of cases/components.
      case 'fill_recurrent_transfer':
        return (
          <FillRecurrentTransfer
            transaction={transaction}
            user={user}
            locale={locale}
          />
        );
      //   case 'claim_reward_balance':
      //     return (
      //       <ClaimRewardsTransactionComponent
      //         transaction={transaction as ClaimReward}
      //       />
      //     );
      //   case 'delegate_vesting_shares':
      //     return (
      //       <DelegationTransactionComponent
      //         transaction={transaction as Delegation}
      //       />
      //     );
      //   case 'claim_account':
      //     return (
      //       <ClaimAccountTransactionComponent
      //         transaction={transaction as ClaimAccount}
      //       />
      //     );
      //   case 'savings': {
      //     switch (transaction.subType) {
      //       case 'interest':
      //         return (
      //           <ReceivedInterestsTransactionComponent
      //             transaction={transaction as ReceivedInterests}
      //           />
      //         );
      //       case 'transfer_to_savings':
      //         return (
      //           <DepositSavingsTransactionComponent
      //             transaction={transaction as DepositSavings}
      //           />
      //         );
      //       case 'transfer_from_savings':
      //         return (
      //           <WithdrawSavingsTransactionComponent
      //             transaction={transaction as WithdrawSavings}
      //           />
      //         );
      //       case 'fill_transfer_from_savings':
      //         return (
      //           <FillWithdrawSavingsTransactionComponent
      //             transaction={transaction as StartWithdrawSavings}
      //           />
      //         );
      //     }
      //   }
      //   case 'power_up_down': {
      //     switch (transaction.subType) {
      //       case 'withdraw_vesting':
      //         return (
      //           <PowerDownTransactionComponent
      //             transaction={transaction as PowerDown}
      //           />
      //         );
      //       case 'transfer_to_vesting':
      //         return (
      //           <PowerUpTransactionComponent
      //             transaction={transaction as PowerUp}
      //           />
      //         );
      //     }
      //   }
      //   case 'convert': {
      //     switch (transaction.subType) {
      //       case 'convert':
      //         return (
      //           <ConvertTransactionComponent
      //             transaction={transaction as Convert}
      //           />
      //         );
      //       case 'collateralized_convert':
      //         return (
      //           <CollateralizedConvertTransactionComponent
      //             transaction={transaction as Convert}
      //           />
      //         );
      //       case 'fill_convert_request':
      //         return (
      //           <FillConvertTransactionComponent
      //             transaction={transaction as FillConvert}
      //           />
      //         );
      //       case 'fill_collateralized_convert_request':
      //         return (
      //           <FillCollateralizedConvertTransactionComponent
      //             transaction={transaction as FillCollateralizedConvert}
      //           />
      //         );
      //     }
      //   }

      //   case 'account_create':
      //     return (
      //       <CreateAccountTransactionComponent
      //         transaction={transaction as CreateAccount}
      //       />
      //     );
      //   case 'create_claimed_account':
      //     return (
      //       <CreateClaimedAccountTransactionComponent
      //         transaction={transaction as CreateClaimedAccount}
      //       />
      //     );
    }
  };
  return <View>{getTransactionContent()}</View>;
};

export default TransactionInfo;
