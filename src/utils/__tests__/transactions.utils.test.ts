const mockDecodeMemo = jest.fn((key, memo) => memo.replace('#', 'decoded_'));

jest.mock('components/bridge', () => ({
  decodeMemo: (...args: any[]) => mockDecodeMemo(...args),
}));

jest.mock('utils/localize', () => ({
  translate: jest.fn((key) => key),
}));

jest.mock('utils/format.utils', () => ({
  getSymbol: jest.fn((nai) => {
    const naiMap: {[key: string]: string} = {
      '@000000000021': 'HIVE',
      '@000000000013': 'HBD',
    };
    return naiMap[nai] || 'UNKNOWN';
  }),
  toHP: jest.fn((vests, globals) => {
    return parseFloat(vests.toString().split(' ')[0]) * 0.001;
  }),
}));

const mockDatabase = {
  getAccountHistory: jest.fn(),
};

const mockClient = {
  call: jest.fn(),
  database: mockDatabase,
};

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(() => mockClient),
}));

import {translate} from 'utils/localize';
import TransactionUtils, {
  CONVERT_TYPE_TRANSACTIONS,
  HAS_IN_OUT_TRANSACTIONS,
  MINIMUM_FETCHED_TRANSACTIONS,
  NB_TRANSACTION_FETCHED,
  TRANSFER_TYPE_TRANSACTIONS,
} from '../transactions.utils';

// Use the mock function directly
const decodeMemoMock = mockDecodeMemo;

describe('transactions.utils', () => {
  const mockGlobals = {
    head_block_number: 1000000,
    total_vesting_fund_hive: '1000000.000 HIVE',
    total_vesting_shares: '2000000.000 VESTS',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constants', () => {
    it('should export MINIMUM_FETCHED_TRANSACTIONS', () => {
      expect(MINIMUM_FETCHED_TRANSACTIONS).toBe(1);
    });

    it('should export NB_TRANSACTION_FETCHED', () => {
      expect(NB_TRANSACTION_FETCHED).toBe(200);
    });

    it('should export HAS_IN_OUT_TRANSACTIONS', () => {
      expect(HAS_IN_OUT_TRANSACTIONS).toContain('transfer');
      expect(HAS_IN_OUT_TRANSACTIONS).toContain('delegate_vesting_shares');
    });

    it('should export TRANSFER_TYPE_TRANSACTIONS', () => {
      expect(TRANSFER_TYPE_TRANSACTIONS).toContain('transfer');
      expect(TRANSFER_TYPE_TRANSACTIONS).toContain('recurrent_transfer');
    });

    it('should export CONVERT_TYPE_TRANSACTIONS', () => {
      expect(CONVERT_TYPE_TRANSACTIONS).toContain('convert');
      expect(CONVERT_TYPE_TRANSACTIONS).toContain('fill_convert_request');
    });
  });

  describe('getAccountTransactions', () => {
    it('should fetch account transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '1 HIVE', memo: ''},
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
        'memo_key',
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result[0])).toBe(true);
      expect(result[0].length).toBeGreaterThan(0);
    });

    it('should return empty array when limit is 0', async () => {
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        0,
        mockGlobals,
      );
      expect(result[0]).toEqual([]);
      expect(result[1]).toBe(0);
    });

    it('should return empty array when start is null and limit is 0', async () => {
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        null,
        mockGlobals,
      );
      expect(result[0]).toEqual([]);
    });

    it('should handle transfer transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '1.000 HIVE', memo: 'test'},
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
        'memo_key',
      );
      expect(result[0][0].type).toBe('transfer');
      expect(result[0][0].subType).toBe('transfer');
    });

    it('should handle recurrent_transfer transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'recurrent_transfer',
              {
                from: 'user1',
                to: 'user2',
                amount: '1.000 HIVE',
                memo: 'test',
                recurrence: 24,
                executions: 10,
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
        'memo_key',
      );
      expect(result[0][0].type).toBe('transfer');
      expect(result[0][0].subType).toBe('recurrent_transfer');
    });

    it('should handle fill_recurrent_transfer with string amount', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'fill_recurrent_transfer',
              {
                from: 'user1',
                to: 'user2',
                amount: '1.000 HIVE',
                memo: 'test',
                remaining_executions: 5,
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
        'memo_key',
      );
      expect(result[0][0].type).toBe('transfer');
      expect(result[0][0].subType).toBe('fill_recurrent_transfer');
    });

    it('should handle fill_recurrent_transfer with object amount', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'fill_recurrent_transfer',
              {
                from: 'user1',
                to: 'user2',
                amount: {amount: '100000', nai: '@000000000021'},
                memo: 'test',
                remaining_executions: 5,
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
        'memo_key',
      );
      expect(result[0][0].type).toBe('transfer');
    });

    it('should handle claim_reward_balance transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'claim_reward_balance',
              {
                account: 'user1',
                reward_hive: '1.000 HIVE',
                reward_hbd: '0.500 HBD',
                reward_vests: '1000.000000 VESTS',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('claim_reward_balance');
    });

    it('should handle delegate_vesting_shares transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'delegate_vesting_shares',
              {
                delegator: 'user1',
                delegatee: 'user2',
                vesting_shares: '1000.000000 VESTS',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('delegate_vesting_shares');
    });

    it('should handle transfer_to_vesting transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer_to_vesting',
              {
                from: 'user1',
                to: 'user1',
                amount: '1.000 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('power_up_down');
      expect(result[0][0].subType).toBe('transfer_to_vesting');
    });

    it('should handle withdraw_vesting transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'withdraw_vesting',
              {
                account: 'user1',
                vesting_shares: '1000.000000 VESTS',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('power_up_down');
      expect(result[0][0].subType).toBe('withdraw_vesting');
    });

    it('should handle interest transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'interest',
              {
                owner: 'user1',
                interest: '1.000 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('savings');
      expect(result[0][0].subType).toBe('interest');
    });

    it('should handle transfer_to_savings transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer_to_savings',
              {
                from: 'user1',
                to: 'user1',
                amount: '1.000 HIVE',
                memo: 'test',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('savings');
      expect(result[0][0].subType).toBe('transfer_to_savings');
    });

    it('should handle transfer_from_savings transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer_from_savings',
              {
                from: 'user1',
                request_id: 1,
                to: 'user1',
                amount: '1.000 HIVE',
                memo: 'test',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('savings');
      expect(result[0][0].subType).toBe('transfer_from_savings');
    });

    it('should handle fill_transfer_from_savings transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'fill_transfer_from_savings',
              {
                from: 'user1',
                to: 'user1',
                amount: '1.000 HIVE',
                request_id: 1,
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('savings');
      expect(result[0][0].subType).toBe('fill_transfer_from_savings');
    });

    it('should handle convert transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'convert',
              {
                owner: 'user1',
                requestid: 1,
                amount: '1.000 HBD',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('convert');
      expect(result[0][0].subType).toBe('convert');
    });

    it('should handle collateralized_convert transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'collateralized_convert',
              {
                owner: 'user1',
                requestid: 1,
                collateral_amount: '1.000 HBD',
                amount_out: '5.000 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('convert');
      expect(result[0][0].subType).toBe('collateralized_convert');
    });

    it('should handle fill_convert_request transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'fill_convert_request',
              {
                owner: 'user1',
                requestid: 1,
                amount_in: '1.000 HBD',
                amount_out: '5.000 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('convert');
      expect(result[0][0].subType).toBe('fill_convert_request');
    });

    it('should handle fill_collateralized_convert_request transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'fill_collateralized_convert_request',
              {
                owner: 'user1',
                requestid: 1,
                amount_in: '1.000 HBD',
                amount_out: '5.000 HIVE',
                excess_collateral: '0.100 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('convert');
      expect(result[0][0].subType).toBe('fill_collateralized_convert_request');
    });

    it('should handle claim_account transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'claim_account',
              {
                creator: 'user1',
                fee: '0.000 HIVE',
                extensions: [],
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('account_create');
      expect(result[0][0].subType).toBe('claim_account');
    });

    it('should handle create_claimed_account transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'create_claimed_account',
              {
                creator: 'user1',
                new_account_name: 'newuser',
                owner: {} as any,
                active: {} as any,
                posting: {} as any,
                memo_key: 'STM...',
                json_metadata: '',
                extensions: [],
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('account_create');
      expect(result[0][0].subType).toBe('create_claimed_account');
    });

    it('should handle account_create transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'account_create',
              {
                creator: 'user1',
                new_account_name: 'newuser',
                fee: '3.000 HIVE',
                owner: {} as any,
                active: {} as any,
                posting: {} as any,
                memo_key: 'STM...',
                json_metadata: '',
                extensions: [],
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('account_create');
      expect(result[0][0].subType).toBe('account_create');
    });

    it('should handle escrow_transfer transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'escrow_transfer',
              {
                from: 'user1',
                to: 'user2',
                escrow_id: 1,
                agent: 'agent',
                hbd_amount: '1.000 HBD',
                hive_amount: '2.000 HIVE',
                fee: '0.010 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('escrow_transfer');
    });

    it('should handle escrow_approve transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'escrow_approve',
              {
                from: 'user1',
                to: 'user2',
                escrow_id: 1,
                approve: true,
                who: 'user1',
                agent: 'agent',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('escrow_approve');
    });

    it('should handle escrow_dispute transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'escrow_dispute',
              {
                from: 'user1',
                to: 'user2',
                escrow_id: 1,
                who: 'user2',
                agent: 'agent',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('escrow_dispute');
    });

    it('should handle escrow_release transactions', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'escrow_release',
              {
                from: 'user1',
                to: 'user2',
                escrow_id: 1,
                who: 'user1',
                receiver: 'user2',
                agent: 'agent',
                hbd_amount: '0.000 HBD',
                hive_amount: '2.000 HIVE',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].type).toBe('escrow_release');
    });

    it('should set last flag when appropriate', async () => {
      const mockHistory = [
        [
          100,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '1 HIVE', memo: ''},
            ],
            trx_id: 'tx1',
            block: 100,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
        [
          99,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '2 HIVE', memo: ''},
            ],
            trx_id: 'tx2',
            block: 99,
            timestamp: '2023-01-01T00:00:01',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        100,
        mockGlobals,
      );
      // Last transaction should have last flag set
      expect(result[0][result[0].length - 1].last).toBe(true);
    });

    it('should set lastFetched flag when appropriate', async () => {
      const mockHistory = [
        [
          150,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '1 HIVE', memo: ''},
            ],
            trx_id: 'tx1',
            block: 150,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
        [
          149,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '2 HIVE', memo: ''},
            ],
            trx_id: 'tx2',
            block: 149,
            timestamp: '2023-01-01T00:00:01',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        150,
        mockGlobals,
      );
      // Last transaction should have lastFetched flag set when limit < NB_TRANSACTION_FETCHED
      expect(result[0][result[0].length - 1].lastFetched).toBe(true);
    });

    it('should handle transactions with zero trx_id', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer',
              {from: 'user1', to: 'user2', amount: '1 HIVE', memo: ''},
            ],
            trx_id: '0000000000000000000000000000000000000000',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result[0][0].url).toContain('hivehub.dev/b/');
    });

    it('should handle Request Timeout error', async () => {
      mockDatabase.getAccountHistory
        .mockRejectedValueOnce(new Error('Request Timeout'))
        .mockResolvedValueOnce([]);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result).toBeDefined();
    });

    it('should handle other errors and retry with adjusted sequence', async () => {
      const mockError = {
        message: 'Some error',
        jse_info: {
          stack: [
            {
              data: {
                sequence: 500,
              },
            },
          ],
        },
      };
      mockDatabase.getAccountHistory
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce([]);
      const result = await TransactionUtils.getAccountTransactions(
        'user1',
        1000000,
        mockGlobals,
      );
      expect(result).toBeDefined();
    });
  });

  describe('getLastTransaction', () => {
    it('should get last transaction index', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: ['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const result = await TransactionUtils.getLastTransaction('user1');
      expect(result).toBe(1000000);
    });

    it('should return -1 when no transactions found', async () => {
      mockDatabase.getAccountHistory.mockResolvedValue([]);
      const result = await TransactionUtils.getLastTransaction('user1');
      expect(result).toBe(-1);
    });
  });

  describe('decodeMemoIfNeeded', () => {
    it('should decode memo when it starts with #', async () => {
      const transfer = {
        from: 'user1',
        to: 'user2',
        amount: '1 HIVE',
        memo: '#encrypted_memo',
      };
      const result = await TransactionUtils.decodeMemoIfNeeded(
        transfer as any,
        'memo_key',
      );
      expect(mockDecodeMemo).toHaveBeenCalledWith(
        'memo_key',
        '#encrypted_memo',
      );
      expect(result.memo).toBe('decoded_encrypted_memo');
    });

    it('should return transfer unchanged when memo does not start with #', async () => {
      const transfer = {
        from: 'user1',
        to: 'user2',
        amount: '1 HIVE',
        memo: 'plain_memo',
      };
      const decodeMemoCallCount = mockDecodeMemo.mock.calls.length;
      const result = await TransactionUtils.decodeMemoIfNeeded(
        transfer as any,
        'memo_key',
      );
      expect(result.memo).toBe('plain_memo');
      // decodeMemo should not be called for plain memos
      expect(mockDecodeMemo.mock.calls.length).toBe(decodeMemoCallCount);
    });

    it('should use translate when memo starts with # but no memoKey provided', async () => {
      const transfer = {
        from: 'user1',
        to: 'user2',
        amount: '1 HIVE',
        memo: '#encrypted_memo',
      };
      const result = await TransactionUtils.decodeMemoIfNeeded(
        transfer as any,
        '',
      );
      expect(translate).toHaveBeenCalledWith('wallet.add_memo');
      expect(result.memo).toBe('wallet.add_memo');
    });

    it('should handle decodeMemo errors gracefully', async () => {
      mockDecodeMemo.mockRejectedValueOnce(new Error('Decode error'));
      const transfer = {
        from: 'user1',
        to: 'user2',
        amount: '1 HIVE',
        memo: '#encrypted_memo',
      };
      const result = await TransactionUtils.decodeMemoIfNeeded(
        transfer as any,
        'memo_key',
      );
      expect(result.memo).toBe('#encrypted_memo'); // Should return original on error
    });
  });

  describe('searchForTransaction', () => {
    it('should search for transaction', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer',
              {
                from: 'user1',
                to: 'user2',
                amount: '1.000 HIVE',
                memo: 'test_memo',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-02T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const transfer: any = [
        'transfer',
        {
          to: 'user2',
          amount: '1.000 HIVE',
          memo: 'test_memo',
        },
      ];
      const afterDate = new Date('2023-01-01T00:00:00');
      const result = await TransactionUtils.searchForTransaction(
        transfer,
        afterDate,
      );
      expect(result).toBeDefined();
    });

    it('should return undefined when transaction not found', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer',
              {
                from: 'user1',
                to: 'user2',
                amount: '2.000 HIVE',
                memo: 'different_memo',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-02T00:00:00',
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const transfer: any = [
        'transfer',
        {
          to: 'user2',
          amount: '1.000 HIVE',
          memo: 'test_memo',
        },
      ];
      const afterDate = new Date('2023-01-01T00:00:00');
      const result = await TransactionUtils.searchForTransaction(
        transfer,
        afterDate,
      );
      expect(result).toBeUndefined();
    });

    it('should filter by date', async () => {
      const mockHistory = [
        [
          1000000,
          {
            op: [
              'transfer',
              {
                from: 'user1',
                to: 'user2',
                amount: '1.000 HIVE',
                memo: 'test_memo',
              },
            ],
            trx_id: 'tx1',
            block: 1000000,
            timestamp: '2023-01-01T00:00:00', // Before afterDate
          },
        ],
      ];
      mockDatabase.getAccountHistory.mockResolvedValue(mockHistory);
      const transfer: any = [
        'transfer',
        {
          to: 'user2',
          amount: '1.000 HIVE',
          memo: 'test_memo',
        },
      ];
      const afterDate = new Date('2023-01-02T00:00:00');
      const result = await TransactionUtils.searchForTransaction(
        transfer,
        afterDate,
      );
      expect(result).toBeUndefined();
    });
  });
});
