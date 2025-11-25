jest.mock('components/bridge', () => ({
  decodeMemo: jest.fn(),
}));

import {WalletHistoryUtils} from '../walletHistoryUtils';
import {
  Transfer,
  ClaimReward,
  PowerDown,
  PowerUp,
  DepositSavings,
  Convert,
  ReceivedInterests,
  Delegation,
} from 'src/interfaces/transaction.interface';

describe('walletHistoryUtils', () => {
  describe('filterTransfer', () => {
    it('should filter by memo', () => {
      const transfer: Transfer = {
        memo: 'test memo',
        amount: '10 HIVE',
        to: 'user2',
        from: 'user1',
      } as Transfer;
      const result = WalletHistoryUtils.filterTransfer(transfer, 'memo', 'user1');
      expect(result).toBe(true);
    });

    it('should filter by amount', () => {
      const transfer: Transfer = {
        memo: '',
        amount: '10 HIVE',
        to: 'user2',
        from: 'user1',
      } as Transfer;
      const result = WalletHistoryUtils.filterTransfer(transfer, '10', 'user1');
      expect(result).toBe(true);
    });

    it('should filter by to address', () => {
      const transfer: Transfer = {
        memo: '',
        amount: '10 HIVE',
        to: 'user2',
        from: 'user1',
      } as Transfer;
      const result = WalletHistoryUtils.filterTransfer(transfer, 'user2', 'user1');
      expect(result).toBe(true);
    });
  });

  describe('filterClaimReward', () => {
    it('should filter by reward amounts', () => {
      const claim: ClaimReward = {
        hbd: '1.000 HBD',
        hive: '2.000 HIVE',
        hp: '3.000 HP',
      } as ClaimReward;
      const result = WalletHistoryUtils.filterClaimReward(claim, '1.000');
      expect(result).toBe(true);
    });
  });

  describe('filterPowerUpDown', () => {
    it('should filter by amount', () => {
      const powerUp: PowerUp = {
        amount: '10.000 HIVE',
      } as PowerUp;
      const result = WalletHistoryUtils.filterPowerUpDown(powerUp, '10');
      expect(result).toBe(true);
    });
  });

  describe('filterSavingsTransaction', () => {
    it('should filter by amount', () => {
      const savings: DepositSavings = {
        amount: '5.000 HBD',
      } as DepositSavings;
      const result = WalletHistoryUtils.filterSavingsTransaction(savings, '5');
      expect(result).toBe(true);
    });
  });

  describe('filterConversion', () => {
    it('should filter convert transactions', () => {
      const convert: Convert = {
        amount: '10 HIVE',
      } as Convert;
      const result = WalletHistoryUtils.filterConversion(convert, '10');
      expect(result).toBe(true);
    });
  });

  describe('filterInterest', () => {
    it('should filter interest transactions', () => {
      const interest: ReceivedInterests = {
        interest: '1.000 HBD',
      } as ReceivedInterests;
      const result = WalletHistoryUtils.filterInterest(interest, '1.000');
      expect(result).toBe(true);
    });
  });

  describe('filterDelegation', () => {
    it('should filter delegation transactions', () => {
      const delegation: Delegation = {
        amount: '100.000 HP',
        delegatee: 'user2',
        delegator: 'user1',
      } as Delegation;
      const result = WalletHistoryUtils.filterDelegation(delegation, 'user2', 'user1');
      expect(result).toBe(true);
    });
  });
});
