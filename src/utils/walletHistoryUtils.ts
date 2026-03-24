import {ActiveAccount} from 'actions/interfaces';
import {EscrowHistoryUtils} from 'hive-keychain-commons';
import moment from 'moment';
import {WalletHistoryFilter} from 'src/interfaces/walletHistory.interface';
import {
  ClaimReward,
  CollateralizedConvert,
  Convert,
  Delegation,
  DepositSavings,
  EscrowApprove,
  EscrowDispute,
  EscrowRelease,
  EscrowTransfer,
  FillCollateralizedConvert,
  FillConvert,
  PowerDown,
  PowerUp,
  ReceivedInterests,
  StartWithdrawSavings,
  Transaction,
  Transfer,
  WithdrawSavings,
} from '../interfaces/transaction.interface';
import {
  HAS_IN_OUT_TRANSACTIONS,
  TRANSFER_TYPE_TRANSACTIONS,
} from './transactions.utils';

/** Hive op types grouped under the single wallet history filter category "Escrow". */
export const ESCROW_TRANSACTION_TYPES = [
  'escrow_transfer',
  'escrow_approve',
  'escrow_dispute',
  'escrow_release',
] as const;

/**
 * Builds the list of selected category keys for filtering, including legacy
 * persisted keys (per-op escrow types) mapped to the unified `escrow` category.
 */
const getSelectedTransactionTypesForFiltering = (
  selectedTransactionTypes: WalletHistoryFilter['selectedTransactionTypes'],
): string[] => {
  const selected = Object.keys(selectedTransactionTypes).filter(
    (key) => selectedTransactionTypes[key],
  );

  const legacyEscrowSelected = ESCROW_TRANSACTION_TYPES.some((type) =>
    selected.includes(type),
  );
  const escrowSelected =
    selected.includes('escrow') || legacyEscrowSelected;

  const cleaned = selected.filter(
    (k) =>
      k !== 'escrow' &&
      !ESCROW_TRANSACTION_TYPES.includes(
        k as (typeof ESCROW_TRANSACTION_TYPES)[number],
      ),
  );

  if (escrowSelected) {
    cleaned.push('escrow');
  }

  return cleaned;
};

const transactionMatchesSelectedType = (
  transactionType: string,
  selectedTypes: string[],
): boolean => {
  if (selectedTypes.length === 0) {
    return true;
  }
  if (selectedTypes.includes(transactionType)) {
    return true;
  }
  if (
    selectedTypes.includes('escrow') &&
    ESCROW_TRANSACTION_TYPES.includes(
      transactionType as (typeof ESCROW_TRANSACTION_TYPES)[number],
    )
  ) {
    return true;
  }
  return false;
};

const filterTransfer = (
  transfer: Transfer,
  filterValue: string,
  activeAccountName: string,
) => {
  return (
    transfer.memo?.toLowerCase().includes(filterValue.toLowerCase()) ||
    transfer.amount?.toLowerCase().includes(filterValue.toLowerCase()) ||
    (transfer.to !== activeAccountName &&
      transfer.to?.toLowerCase().includes(filterValue.toLowerCase())) ||
    (transfer.from !== activeAccountName &&
      transfer.from?.toLowerCase().includes(filterValue.toLowerCase()))
  );
};

const filterClaimReward = (claim: ClaimReward, filterValue: string) => {
  return [claim.hbd, claim.hive, claim.hp]
    .join(' ')
    .toLowerCase()
    .includes(filterValue.toLowerCase());
};

const filterPowerUpDown = (
  transaction: PowerDown | PowerUp,
  filterValue: string,
) => {
  return transaction.amount.toLowerCase().includes(filterValue.toLowerCase());
};

const filterSavingsTransaction = (
  transaction: WithdrawSavings | DepositSavings | StartWithdrawSavings,
  filterValue: string,
) => {
  return transaction.amount.toLowerCase().includes(filterValue.toLowerCase());
};

const filterDelegation = (
  delegation: Delegation,
  filterValue: string,
  activeAccountName: string,
) => {
  return (
    delegation.amount.toLowerCase().includes(filterValue.toLowerCase()) ||
    (delegation.delegatee !== activeAccountName &&
      delegation.delegatee
        ?.toLowerCase()
        .includes(filterValue.toLowerCase())) ||
    (delegation.delegator !== activeAccountName &&
      delegation.delegator?.toLowerCase().includes(filterValue.toLowerCase()))
  );
};

export const filterInterest = (
  interest: ReceivedInterests,
  filterValue: string,
) => {
  return interest.interest.toLowerCase().includes(filterValue.toLowerCase());
};

export const filterConversion = (
  conversion: Convert | CollateralizedConvert,
  filterValue: string,
) => {
  return conversion.amount
    .toString()
    .toLowerCase()
    .includes(filterValue.toLowerCase());
};

export const filterFillConversion = (
  fillConversion: FillConvert | FillCollateralizedConvert,
  filterValue: string,
) => {
  return (
    fillConversion.amount_in
      .toString()
      .toLowerCase()
      .includes(filterValue.toLowerCase()) ||
    fillConversion.amount_out
      .toString()
      .toLowerCase()
      .includes(filterValue.toLowerCase())
  );
};

const applyAllFilters = (
  transactionsList: Transaction[],
  filter: WalletHistoryFilter,
  activeAccount: ActiveAccount,
) => {
  const selectedTransactionsTypes = getSelectedTransactionTypesForFiltering(
    filter.selectedTransactionTypes,
  );
  let filteredTransactions = transactionsList.filter(
    (transaction: Transaction) => {
      const isInOrOutSelected = filter.inSelected || filter.outSelected;
      if (transactionMatchesSelectedType(transaction.type, selectedTransactionsTypes)) {
        if (
          HAS_IN_OUT_TRANSACTIONS.includes(transaction.type) &&
          isInOrOutSelected
        ) {
          return (
            (filter.inSelected &&
              ((TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
                (transaction as Transfer).to === activeAccount.name!) ||
                (transaction.type === 'delegate_vesting_shares' &&
                  (transaction as Delegation).delegatee ===
                    activeAccount.name!))) ||
            (filter.outSelected &&
              ((TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
                (transaction as Transfer).from === activeAccount.name!) ||
                (transaction.type === 'delegate_vesting_shares' &&
                  (transaction as Delegation).delegator ===
                    activeAccount.name!)))
          );
        } else {
          return true;
        }
      }
    },
  );

  return filteredTransactions.filter((transaction) => {
    return (
      (TRANSFER_TYPE_TRANSACTIONS.includes(transaction.type) &&
        WalletHistoryUtils.filterTransfer(
          transaction as Transfer,
          filter.filterValue,
          activeAccount.name!,
        )) ||
      (transaction.type === 'claim_reward_balance' &&
        WalletHistoryUtils.filterClaimReward(
          transaction as ClaimReward,
          filter.filterValue,
        )) ||
      (transaction.type === 'delegate_vesting_shares' &&
        WalletHistoryUtils.filterDelegation(
          transaction as Delegation,
          filter.filterValue,
          activeAccount.name!,
        )) ||
      (transaction.subType === 'withdraw_vesting' &&
        WalletHistoryUtils.filterPowerUpDown(
          transaction as PowerDown,
          filter.filterValue,
        )) ||
      (transaction.subType === 'transfer_to_vesting' &&
        WalletHistoryUtils.filterPowerUpDown(
          transaction as PowerUp,
          filter.filterValue,
        )) ||
      (transaction.subType === 'transfer_from_savings' &&
        WalletHistoryUtils.filterSavingsTransaction(
          transaction as WithdrawSavings,
          filter.filterValue,
        )) ||
      (transaction.subType === 'transfer_to_savings' &&
        WalletHistoryUtils.filterSavingsTransaction(
          transaction as DepositSavings,
          filter.filterValue,
        )) ||
      (transaction.subType === 'interest' &&
        WalletHistoryUtils.filterInterest(
          transaction as ReceivedInterests,
          filter.filterValue,
        )) ||
      (transaction.subType === 'fill_collateralized_convert_request' &&
        WalletHistoryUtils.filterFillConversion(
          transaction as FillCollateralizedConvert,
          filter.filterValue,
        )) ||
      (transaction.subType === 'fill_convert_request' &&
        WalletHistoryUtils.filterFillConversion(
          transaction as FillConvert,
          filter.filterValue,
        )) ||
      (transaction.subType === 'collateralized_convert' &&
        WalletHistoryUtils.filterConversion(
          transaction as CollateralizedConvert,
          filter.filterValue,
        )) ||
      (transaction.subType === 'convert' &&
        WalletHistoryUtils.filterConversion(
          transaction as Convert,
          filter.filterValue,
        )) ||
      (transaction.type === 'escrow_transfer' &&
        WalletHistoryUtils.filterEscrowTransfer(
          transaction as EscrowTransfer,
          filter.filterValue,
        )) ||
      (transaction.type === 'escrow_approve' &&
        WalletHistoryUtils.filterEscrowApprove(
          transaction as EscrowApprove,
          filter.filterValue,
        )) ||
      (transaction.type === 'escrow_dispute' &&
        WalletHistoryUtils.filterEscrowDispute(
          transaction as EscrowDispute,
          filter.filterValue,
        )) ||
      (transaction.type === 'escrow_release' &&
        WalletHistoryUtils.filterEscrowRelease(
          transaction as EscrowRelease,
          filter.filterValue,
        )) ||
      (transaction.timestamp &&
        moment(transaction.timestamp)
          .format('L')
          .includes(filter.filterValue.toLowerCase()))
    );
  });
};

export const WalletHistoryUtils = {
  filterTransfer,
  filterClaimReward,
  filterDelegation,
  filterPowerUpDown,
  filterSavingsTransaction,
  filterInterest,
  filterFillConversion,
  filterConversion,
  filterEscrowTransfer: EscrowHistoryUtils.filterEscrowTransfer,
  filterEscrowApprove: EscrowHistoryUtils.filterEscrowApprove,
  filterEscrowDispute: EscrowHistoryUtils.filterEscrowDispute,
  filterEscrowRelease: EscrowHistoryUtils.filterEscrowRelease,
  applyAllFilters,
};
