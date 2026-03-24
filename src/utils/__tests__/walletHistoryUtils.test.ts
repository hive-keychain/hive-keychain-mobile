jest.mock('components/bridge', () => ({
  decodeMemo: jest.fn(),
}));

import {ActiveAccount} from 'actions/interfaces';
import {DEFAULT_WALLET_FILTER} from 'reducers/historyFilters';
import {WalletHistoryFilter} from 'src/interfaces/walletHistory.interface';
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
  EscrowApprove,
  EscrowDispute,
  EscrowRelease,
  EscrowTransfer,
  Transaction,
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

  describe('escrow filters', () => {
    it('should filter escrow transfer transactions', () => {
      const escrow: EscrowTransfer = {
        from: 'user1',
        to: 'user2',
        hive_amount: '1.000 HIVE',
        hbd_amount: '0.000 HBD',
        fee: '0.010 HIVE',
        agent: 'agent',
        escrow_id: 7,
      } as EscrowTransfer;
      const result = WalletHistoryUtils.filterEscrowTransfer(escrow, 'agent');
      expect(result).toBe(true);
    });

    it('should filter escrow approve transactions', () => {
      const escrow: EscrowApprove = {
        from: 'user1',
        to: 'user2',
        who: 'user1',
        agent: 'agent',
        escrow_id: 8,
        approve: true,
      } as EscrowApprove;
      const result = WalletHistoryUtils.filterEscrowApprove(escrow, '8');
      expect(result).toBe(true);
    });

    it('should filter escrow dispute transactions', () => {
      const escrow: EscrowDispute = {
        from: 'user1',
        to: 'user2',
        who: 'user2',
        agent: 'agent',
        escrow_id: 9,
      } as EscrowDispute;
      const result = WalletHistoryUtils.filterEscrowDispute(escrow, 'user2');
      expect(result).toBe(true);
    });

    it('should filter escrow release transactions', () => {
      const escrow: EscrowRelease = {
        from: 'user1',
        to: 'user2',
        who: 'user1',
        receiver: 'user2',
        agent: 'agent',
        hive_amount: '1.000 HIVE',
        hbd_amount: '0.000 HBD',
        escrow_id: 10,
      } as EscrowRelease;
      const result = WalletHistoryUtils.filterEscrowRelease(escrow, '10');
      expect(result).toBe(true);
    });
  });

  describe('applyAllFilters — escrow category', () => {
    const baseTx = {
      blockNumber: 1,
      txId: 'x',
      index: 0,
      key: 'k',
      timestamp: '2020-01-01T00:00:00',
      url: '',
    };

    const activeAccount = {name: 'user1'} as ActiveAccount;

    it('includes all escrow op types when the unified escrow filter is selected', () => {
      const transfer = {
        ...baseTx,
        type: 'transfer',
        amount: '1 HIVE',
        from: 'a',
        to: 'user1',
        memo: '',
      } as Transfer;

      const escrowTransfer = {
        ...baseTx,
        txId: 'e1',
        type: 'escrow_transfer',
        from: 'user1',
        to: 'user2',
        hive_amount: '1.000 HIVE',
        hbd_amount: '0.000 HBD',
        fee: '0.010 HIVE',
        agent: 'agent',
        escrow_id: 1,
      } as EscrowTransfer;

      const escrowApprove = {
        ...baseTx,
        txId: 'e2',
        type: 'escrow_approve',
        from: 'user1',
        to: 'user2',
        who: 'user1',
        agent: 'agent',
        escrow_id: 2,
        approve: true,
      } as EscrowApprove;

      const list: Transaction[] = [transfer, escrowTransfer, escrowApprove];

      const out = WalletHistoryUtils.applyAllFilters(
        list,
        {
          ...DEFAULT_WALLET_FILTER,
          selectedTransactionTypes: {
            ...DEFAULT_WALLET_FILTER.selectedTransactionTypes,
            escrow: true,
          },
        },
        activeAccount,
      );

      expect(out).toHaveLength(2);
      expect(out.map((t) => t.type).sort()).toEqual(
        ['escrow_approve', 'escrow_transfer'].sort(),
      );
    });

    it('maps legacy per-op escrow filter keys to the unified escrow category', () => {
      const escrowRelease = {
        ...baseTx,
        type: 'escrow_release',
        from: 'user1',
        to: 'user2',
        who: 'user1',
        receiver: 'user2',
        agent: 'agent',
        hive_amount: '1.000 HIVE',
        hbd_amount: '0.000 HBD',
        escrow_id: 3,
      } as EscrowRelease;

      const selectedTransactionTypes: WalletHistoryFilter['selectedTransactionTypes'] =
        {
          ...DEFAULT_WALLET_FILTER.selectedTransactionTypes,
          escrow_approve: true,
        };

      const out = WalletHistoryUtils.applyAllFilters(
        [escrowRelease],
        {
          ...DEFAULT_WALLET_FILTER,
          selectedTransactionTypes,
        },
        activeAccount,
      );

      expect(out).toHaveLength(1);
      expect(out[0].type).toBe('escrow_release');
    });
  });
});
