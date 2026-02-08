import {TokenTransactionUtils} from '../tokenTransaction.utils';
import {
  OperationsHiveEngine,
  TransferTokenTransaction,
  StakeTokenTransaction,
  DelegationTokenTransaction,
  CommentCurationTransaction,
  MiningLotteryTransaction,
  TokenTransaction,
} from 'src/interfaces/tokens.interface';
import moment from 'moment';

describe('TokenTransactionUtils', () => {
  describe('filterTransfer', () => {
    it('should filter by to address', () => {
      const transaction: TransferTokenTransaction = {
        to: 'user2',
        from: 'user1',
        memo: 'test',
      } as TransferTokenTransaction;
      const result = TokenTransactionUtils.filterTransfer(transaction, 'user2');
      expect(result).toBe(true);
    });

    it('should filter by from address', () => {
      const transaction: TransferTokenTransaction = {
        to: 'user2',
        from: 'user1',
        memo: 'test',
      } as TransferTokenTransaction;
      const result = TokenTransactionUtils.filterTransfer(transaction, 'user1');
      expect(result).toBe(true);
    });

    it('should filter by memo', () => {
      const transaction: TransferTokenTransaction = {
        to: 'user2',
        from: 'user1',
        memo: 'test memo',
      } as TransferTokenTransaction;
      const result = TokenTransactionUtils.filterTransfer(transaction, 'memo');
      expect(result).toBe(true);
    });
  });

  describe('filterStake', () => {
    it('should filter by to address', () => {
      const transaction: StakeTokenTransaction = {
        to: 'user2',
        from: 'user1',
      } as StakeTokenTransaction;
      const result = TokenTransactionUtils.filterStake(transaction, 'user2');
      expect(result).toBe(true);
    });
  });

  describe('filterDelegation', () => {
    it('should filter by delegator', () => {
      const transaction: DelegationTokenTransaction = {
        delegator: 'user1',
        delegatee: 'user2',
      } as DelegationTokenTransaction;
      const result = TokenTransactionUtils.filterDelegation(transaction, 'user1');
      expect(result).toBe(true);
    });

    it('should filter by delegatee', () => {
      const transaction: DelegationTokenTransaction = {
        delegator: 'user1',
        delegatee: 'user2',
      } as DelegationTokenTransaction;
      const result = TokenTransactionUtils.filterDelegation(transaction, 'user2');
      expect(result).toBe(true);
    });
  });

  describe('applyAllTokensFilters', () => {
    it('should filter transactions by operation', () => {
      const transactions: TokenTransaction[] = [
        {
          operation: OperationsHiveEngine.TOKENS_TRANSFER,
          to: 'user2',
          from: 'user1',
          amount: '10 BEE',
        } as TokenTransaction,
        {
          operation: OperationsHiveEngine.TOKEN_STAKE,
          to: 'user3',
          from: 'user1',
          amount: '5 BEE',
        } as TokenTransaction,
      ];
      const result = TokenTransactionUtils.applyAllTokensFilters(
        transactions,
        'transfer',
      );
      expect(result.length).toBe(1);
      expect(result[0].operation).toBe(OperationsHiveEngine.TOKENS_TRANSFER);
    });

    it('should filter transactions by amount', () => {
      const transactions: TokenTransaction[] = [
        {
          operation: OperationsHiveEngine.TOKENS_TRANSFER,
          to: 'user2',
          from: 'user1',
          amount: '10 BEE',
        } as TokenTransaction,
        {
          operation: OperationsHiveEngine.TOKENS_TRANSFER,
          to: 'user3',
          from: 'user1',
          amount: '5 BEE',
        } as TokenTransaction,
      ];
      const result = TokenTransactionUtils.applyAllTokensFilters(
        transactions,
        '10',
      );
      expect(result.length).toBe(1);
    });
  });
});
