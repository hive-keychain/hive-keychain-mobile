import {ActiveAccount} from 'actions/interfaces';
import React from 'react';
import {View} from 'react-native';
import {
  ClaimAccount,
  ClaimReward,
  Convert,
  CreateAccount,
  CreateClaimedAccount,
  Delegation,
  DepositSavings,
  FillCollateralizedConvert,
  FillConvert,
  FillRecurrentTransfer as FillRecurrentTransferInterface,
  PowerDown,
  PowerUp,
  ReceivedInterests,
  RecurrentTransfer as RecurrentTransferInterface,
  StartWithdrawSavings,
  Transaction,
  Transfer as TransferInterface,
  WithdrawSavings,
} from 'src/interfaces/transaction.interface';
import ClaimAccountTransactionComponent from './ClaimAccountTransactionComponent';
import ClaimRewardsTransactionComponent from './ClaimRewardsTransactionComponent';
import CollateralizedConvertTransactionComponent from './CollateralizedConvertTransactionComponent';
import ConvertTransactionComponent from './ConvertTransactionComponent';
import CreateAccountTransactionComponent from './CreateAccountTransactionComponent';
import CreateClaimedAccountTransactionComponent from './CreateClaimedAccountTransactionComponent';
import DelegationTransactionComponent from './DelegationTransactionComponent';
import DepositSavingsTransactionComponent from './DepositSavingsTransactionComponent';
import FillRecurrentTransfer from './Fill-recurrent-transfer';
import FillCollateralizedConvertTransactionComponent from './FillCollateralizedConvertTransactionComponent';
import FillConvertTransactionComponent from './FillConvertTransactionComponent';
import FillWithdrawSavingsTransactionComponent from './FillWithdrawSavingsTransactionComponent';
import PowerDownTransactionComponent from './PowerDownTransactionComponent';
import PowerUpTransactionComponent from './PowerUpTransactionComponent';
import ReceivedInterestsTransactionComponent from './ReceivedInterestsTransactionComponent';
import RecurrentTransfer from './Recurrent-transfer';
import Transfer from './Transfer';
import WithdrawSavingsTransactionComponent from './WithdrawSavingsTransactionComponent';

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
          <Transfer
            transaction={transaction as TransferInterface}
            user={user}
            locale={locale}
          />
        );

      case 'recurrent_transfer':
        return (
          <RecurrentTransfer
            transaction={transaction as RecurrentTransferInterface}
            user={user}
            locale={locale}
          />
        );

      case 'fill_recurrent_transfer':
        return (
          <FillRecurrentTransfer
            transaction={transaction as FillRecurrentTransferInterface}
            user={user}
            locale={locale}
          />
        );

      case 'claim_reward_balance':
        return (
          <ClaimRewardsTransactionComponent
            transaction={transaction as ClaimReward}
            user={user}
            locale={locale}
          />
        );

      case 'delegate_vesting_shares':
        return (
          <DelegationTransactionComponent
            transaction={transaction as Delegation}
            user={user}
            locale={locale}
          />
        );

      case 'claim_account':
        return (
          <ClaimAccountTransactionComponent
            transaction={transaction as ClaimAccount}
            user={user}
            locale={locale}
          />
        );

      case 'savings': {
        switch (transaction.subType) {
          case 'interest':
            return (
              <ReceivedInterestsTransactionComponent
                transaction={transaction as ReceivedInterests}
                user={user}
                locale={locale}
              />
            );
          case 'transfer_to_savings':
            return (
              <DepositSavingsTransactionComponent
                transaction={transaction as DepositSavings}
                user={user}
                locale={locale}
              />
            );
          case 'transfer_from_savings':
            return (
              <WithdrawSavingsTransactionComponent
                transaction={transaction as WithdrawSavings}
                user={user}
                locale={locale}
              />
            );
          case 'fill_transfer_from_savings':
            return (
              <FillWithdrawSavingsTransactionComponent
                transaction={transaction as StartWithdrawSavings}
                user={user}
                locale={locale}
              />
            );
        }
      }
      case 'power_up_down': {
        switch (transaction.subType) {
          case 'withdraw_vesting':
            return (
              <PowerDownTransactionComponent
                transaction={transaction as PowerDown}
                user={user}
                locale={locale}
              />
            );
          case 'transfer_to_vesting':
            return (
              <PowerUpTransactionComponent
                transaction={transaction as PowerUp}
                user={user}
                locale={locale}
              />
            );
        }
      }

      case 'convert': {
        switch (transaction.subType) {
          case 'convert':
            return (
              <ConvertTransactionComponent
                transaction={transaction as Convert}
                user={user}
                locale={locale}
              />
            );
          case 'collateralized_convert':
            return (
              <CollateralizedConvertTransactionComponent
                transaction={transaction as Convert}
                user={user}
                locale={locale}
              />
            );
          case 'fill_convert_request':
            return (
              <FillConvertTransactionComponent
                transaction={transaction as FillConvert}
                user={user}
                locale={locale}
              />
            );
          case 'fill_collateralized_convert_request':
            return (
              <FillCollateralizedConvertTransactionComponent
                transaction={transaction as FillCollateralizedConvert}
                user={user}
                locale={locale}
              />
            );
        }
      }

      case 'account_create':
        return (
          <CreateAccountTransactionComponent
            transaction={transaction as CreateAccount}
            user={user}
            locale={locale}
          />
        );

      case 'create_claimed_account':
        return (
          <CreateClaimedAccountTransactionComponent
            transaction={transaction as CreateClaimedAccount}
            user={user}
            locale={locale}
          />
        );
    }
  };
  return <View>{getTransactionContent()}</View>;
};

export default TransactionInfo;
