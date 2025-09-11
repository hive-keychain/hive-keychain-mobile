import moment from 'moment';
import {
  CURATIONS_REWARDS_TYPES,
  CommentCurationTransaction,
  DelegationTokenTransaction,
  MiningLotteryTransaction,
  OperationsHiveEngine,
  StakeTokenTransaction,
  TokenTransaction,
  TransferTokenTransaction,
} from 'src/interfaces/tokens.interface';

export const HAS_IN_OUT_TOKENS_TRANSACTIONS = [
  OperationsHiveEngine.TOKENS_TRANSFER,
  OperationsHiveEngine.TOKENS_DELEGATE,
];

export const IN_TOKENS_TRANSACTIONS = [
  OperationsHiveEngine.COMMENT_CURATION_REWARD,
  OperationsHiveEngine.COMMENT_AUTHOR_REWARD,
  OperationsHiveEngine.MINING_LOTTERY,
  OperationsHiveEngine.HIVE_PEGGED_BUY,
];

export const OUT_TOKENS_TRANSACTIONS = [
  OperationsHiveEngine.TOKENS_DELEGATE,
  OperationsHiveEngine.TOKENS_TRANSFER,
  OperationsHiveEngine.TOKEN_ISSUE,
];

const filterCurationReward = (
  t: CommentCurationTransaction,
  value: string,
): boolean => {
  value = value.toLowerCase();
  return t.authorPerm.toLowerCase().includes(value);
};

const filterTransfer = (
  t: TransferTokenTransaction,
  value: string,
): boolean => {
  value = value.toLowerCase();
  return (
    t.to.toLowerCase().includes(value) ||
    t.from.toLowerCase().includes(value) ||
    t.memo?.toLowerCase().includes(value)
  );
};

const filterStake = (t: StakeTokenTransaction, value: string): boolean => {
  value = value.toLowerCase();
  return (
    t.to.toLowerCase().includes(value) || t.from.toLowerCase().includes(value)
  );
};

const filterDelegation = (
  t: DelegationTokenTransaction,
  value: string,
): boolean => {
  value = value.toLowerCase();
  return (
    t.delegator.toLowerCase().includes(value) ||
    t.delegatee.toLowerCase().includes(value)
  );
};

const filterMiningLottery = (
  t: MiningLotteryTransaction,
  value: string,
): boolean => {
  value = value.toLowerCase();
  return t.poolId.toLowerCase().includes(value);
};

const applyAllTokensFilters = (
  tokenList: TokenTransaction[],
  filterValue: string,
) =>
  tokenList.filter((item) => {
    return (
      (CURATIONS_REWARDS_TYPES.includes(item.operation) &&
        filterCurationReward(
          item as CommentCurationTransaction,
          filterValue,
        )) ||
      (item.operation === OperationsHiveEngine.TOKENS_TRANSFER &&
        filterTransfer(item as TransferTokenTransaction, filterValue)) ||
      (item.operation === OperationsHiveEngine.TOKEN_STAKE &&
        filterStake(item as StakeTokenTransaction, filterValue)) ||
      (item.operation === OperationsHiveEngine.MINING_LOTTERY &&
        filterMiningLottery(item as MiningLotteryTransaction, filterValue)) ||
      (item.operation === OperationsHiveEngine.TOKENS_DELEGATE &&
        filterDelegation(item as DelegationTokenTransaction, filterValue)) ||
      item.amount.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.operation.toLowerCase().includes(filterValue.toLowerCase()) ||
      (item.timestamp &&
        moment(item.timestamp).format('L').includes(filterValue.toLowerCase()))
    );
  });

export const TokenTransactionUtils = {
  filterTransfer,
  filterStake,
  filterDelegation,
  filterCurationReward,
  filterMiningLottery,
  applyAllTokensFilters,
};
