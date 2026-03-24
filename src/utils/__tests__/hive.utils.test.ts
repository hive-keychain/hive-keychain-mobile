const mockDatabaseCall = jest.fn();
const mockDatabase = {
  getAccounts: jest.fn(),
  getVestingDelegations: jest.fn(),
  call: mockDatabaseCall,
};

const mockRc = {
  findRCAccounts: jest.fn(),
  calculateRCMana: jest.fn(),
};

const mockClientInstance = {
  database: mockDatabase,
  rc: mockRc,
  call: jest.fn(),
};

const mockGetData = jest.fn();

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(() => mockClientInstance),
  getData: jest.fn((...args) => mockGetData(...args)),
  getHardforkVersion: jest.fn(async () => {
    const v = await mockDatabaseCall('get_hardfork_version', []);
    return parseInt(String(v).split('.')[1], 10);
  }),
}));

jest.mock('api/keychain.api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import {ExtendedAccount, DynamicGlobalProperties} from '@hiveio/dhive';
import {GlobalProperties} from 'actions/interfaces';
import {
  getAccount,
  getAccountKeys,
  getAccountPrice,
  getDelegatees,
  getDelegators,
  getConversionRequests,
  getSavingsRequests,
  getVP,
  getVotingDollarsPerAccount,
  getRC,
  getPendingOutgoingUndelegation,
  sanitizeUsername,
  sanitizeAmount,
  getHardforkVersion,
} from '../hive.utils';
import api from 'api/keychain.api';

describe('hive.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccount', () => {
    it('should get account', async () => {
      const mockAccount = {name: 'user1'};
      mockDatabase.getAccounts.mockResolvedValue([mockAccount]);
      const result = await getAccount('user1');
      expect(result).toEqual(mockAccount);
    });
  });

  describe('getDelegatees', () => {
    it('should get delegatees', async () => {
      mockDatabase.getVestingDelegations.mockResolvedValue([
        {delegatee: 'user2', vesting_shares: '100 VESTS'},
      ]);
      const result = await getDelegatees('user1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getDelegators', () => {
    it('should get delegators', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: [{delegator: 'user2', vesting_shares: 100}],
      });
      const result = await getDelegators('user1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getConversionRequests', () => {
    it('should get conversion requests', async () => {
      mockDatabaseCall.mockImplementation((method: string, params: any[]) => {
        if (method === 'get_conversion_requests') {
          return Promise.resolve([
            {
              amount: '10.000 HBD',
              conversion_date: '2023-01-01T00:00:00',
              id: 1,
              owner: 'user1',
              requestid: 1,
            },
          ]);
        }
        if (method === 'get_collateralized_conversion_requests') {
          return Promise.resolve([
            {
              collateral_amount: '20.000 HIVE',
              conversion_date: '2023-01-02T00:00:00',
              id: 2,
              owner: 'user1',
              requestid: 2,
            },
          ]);
        }
        return Promise.resolve([]);
      });
      const result = await getConversionRequests('user1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSavingsRequests', () => {
    it('should get savings requests', async () => {
      mockDatabaseCall.mockImplementation((method: string, params: any[]) => {
        if (method === 'get_savings_withdraw_to') {
          return Promise.resolve([
            {
              to: 'user2',
              amount: '10.000 HBD',
              request_id: 1,
              complete: '2023-01-01T00:00:00',
            },
          ]);
        }
        return Promise.resolve([]);
      });
      const result = await getSavingsRequests('user1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getVP', () => {
    it('should calculate voting power', () => {
      const account: ExtendedAccount = {
        name: 'user1',
        vesting_shares: '1000000 VESTS',
        received_vesting_shares: '500000 VESTS',
        delegated_vesting_shares: '200000 VESTS',
        vesting_withdraw_rate: '0 VESTS',
        voting_manabar: {
          current_mana: '500000',
          last_update_time: Date.now() / 1000 - 1000,
        },
      } as ExtendedAccount;

      const result = getVP(account);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should return null if account has no name', () => {
      const account: ExtendedAccount = {} as ExtendedAccount;
      const result = getVP(account);
      expect(result).toBeNull();
    });

    it('should cap estimated mana at max', () => {
      const account: ExtendedAccount = {
        name: 'user1',
        vesting_shares: '1000000 VESTS',
        received_vesting_shares: '0 VESTS',
        delegated_vesting_shares: '0 VESTS',
        vesting_withdraw_rate: '0 VESTS',
        voting_manabar: {
          current_mana: '1000000',
          last_update_time: Date.now() / 1000 - 1000000, // Very old
        },
      } as ExtendedAccount;

      const result = getVP(account);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe('getVotingDollarsPerAccount', () => {
    it('should calculate voting dollars', () => {
      const account: ExtendedAccount = {
        name: 'user1',
        vesting_shares: '1000000 VESTS',
        received_vesting_shares: '0 VESTS',
        delegated_vesting_shares: '0 VESTS',
      } as ExtendedAccount;

      const properties: GlobalProperties = {
        globals: {} as DynamicGlobalProperties,
        rewardFund: {
          reward_balance: '1000000',
          recent_claims: '10000000',
        },
        price: {
          base: '1.000',
          quote: '1.000',
        },
      } as GlobalProperties;

      (properties.globals as any).vote_power_reserve_rate = 10;

      const result = getVotingDollarsPerAccount(100, properties, account);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return null if no globals', () => {
      const account: ExtendedAccount = {
        name: 'user1',
      } as ExtendedAccount;

      const properties: GlobalProperties = {} as GlobalProperties;

      const result = getVotingDollarsPerAccount(100, properties, account);
      expect(result).toBeNull();
    });

    it('should return null if account has no name', () => {
      const account: ExtendedAccount = {} as ExtendedAccount;
      const properties: GlobalProperties = {
        globals: {} as DynamicGlobalProperties,
      } as GlobalProperties;

      const result = getVotingDollarsPerAccount(100, properties, account);
      expect(result).toBeNull();
    });

  });

  describe('getRC', () => {
    it('should get RC for account', async () => {
      const account: ExtendedAccount = {
        name: 'user1',
      } as ExtendedAccount;

      mockRc.findRCAccounts.mockResolvedValue([{name: 'user1'}]);
      mockRc.calculateRCMana.mockResolvedValue({
        current_mana: '1000000',
        max_mana: '2000000',
      });

      const result = await getRC(account);
      expect(result).toBeDefined();
      expect(mockRc.findRCAccounts).toHaveBeenCalledWith(['user1']);
    });
  });

  describe('getPendingOutgoingUndelegation', () => {
    it('should get pending outgoing undelegations', async () => {
      mockGetData.mockResolvedValue([
        {
          delegator: 'user1',
          expiration: '2024-01-01T00:00:00',
          vesting_shares: {amount: '1000000'},
        },
      ]);

      const result = await getPendingOutgoingUndelegation('user1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('delegator');
        expect(result[0]).toHaveProperty('expiration_date');
        expect(result[0]).toHaveProperty('vesting_shares');
      }
    });

    it('should handle empty delegations', async () => {
      mockGetData.mockResolvedValue([]);
      const result = await getPendingOutgoingUndelegation('user1');
      expect(result).toEqual([]);
    });
  });

  describe('getAccountKeys', () => {
    it('should get account keys', async () => {
      const mockAccount = {
        name: 'user1',
        memo_key: 'STMmemo',
        active: {
          key_auths: [['STMactive', 1]],
        },
        posting: {
          key_auths: [['STMposting', 1]],
        },
      };
      mockDatabase.getAccounts.mockResolvedValue([mockAccount]);

      const result = await getAccountKeys('user1');
      expect(result).toEqual({
        memo: 'STMmemo',
        active: mockAccount.active,
        posting: mockAccount.posting,
      });
    });
  });

  describe('sanitizeUsername', () => {
    it('should lowercase and trim username', () => {
      expect(sanitizeUsername('  USERNAME  ')).toBe('username');
      expect(sanitizeUsername('TestUser')).toBe('testuser');
      expect(sanitizeUsername('user1')).toBe('user1');
    });

    it('should handle empty string', () => {
      expect(sanitizeUsername('')).toBe('');
    });
  });

  describe('sanitizeAmount', () => {
    it('should format amount with currency', () => {
      expect(sanitizeAmount('1000.5', 'HIVE')).toBe('1000.500 HIVE');
      expect(sanitizeAmount('1000,5', 'HBD')).toBe('1000.500 HBD');
    });

    it('should format amount without currency', () => {
      expect(sanitizeAmount('1000.5')).toBe('1000.5');
      expect(sanitizeAmount('1000,5')).toBe('1000.5');
    });

    it('should handle number input', () => {
      expect(sanitizeAmount(1000.5, 'HIVE')).toBe('1000.500 HIVE');
      expect(sanitizeAmount(1000)).toBe('1000');
    });

    it('should respect decimals parameter', () => {
      expect(sanitizeAmount('1000.5678', 'HIVE', 2)).toBe('1000.57 HIVE');
      expect(sanitizeAmount('1000.5678', 'HIVE', 0)).toBe('1001 HIVE');
    });
  });

  describe('getAccountPrice', () => {
    it('should get account creation price', async () => {
      mockDatabaseCall.mockResolvedValue({
        account_creation_fee: '3.000 HIVE',
      });

      const result = await getAccountPrice();
      expect(result).toBeDefined();
      expect(typeof result).toBe('number');
    });
  });

  describe('getHardforkVersion', () => {
    it('should get hardfork version', async () => {
      mockDatabaseCall.mockResolvedValue('1.27.0');
      const result = await getHardforkVersion();
      expect(result).toBe(27);
    });

    it('should handle different version formats', async () => {
      mockDatabaseCall.mockResolvedValue('1.30.5');
      const result = await getHardforkVersion();
      expect(result).toBe(30);
    });
  });

  describe('getConversionRequests', () => {
    it('should filter by HBD when filterResults is HBD', async () => {
      mockDatabaseCall.mockImplementation((method: string) => {
        if (method === 'get_conversion_requests') {
          return Promise.resolve([
            {
              amount: '10.000 HBD',
              conversion_date: '2023-01-01T00:00:00',
              id: 1,
              owner: 'user1',
              requestid: 1,
            },
          ]);
        }
        if (method === 'get_collateralized_conversion_requests') {
          return Promise.resolve([
            {
              collateral_amount: '20.000 HIVE',
              conversion_date: '2023-01-02T00:00:00',
              id: 2,
              owner: 'user1',
              requestid: 2,
            },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await getConversionRequests('user1', 'HBD');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item.amount.split(' ')[1]).toBe('HBD');
      });
    });

    it('should filter by HIVE when filterResults is HIVE', async () => {
      mockDatabaseCall.mockImplementation((method: string) => {
        if (method === 'get_conversion_requests') {
          return Promise.resolve([
            {
              amount: '10.000 HBD',
              conversion_date: '2023-01-01T00:00:00',
              id: 1,
              owner: 'user1',
              requestid: 1,
            },
          ]);
        }
        if (method === 'get_collateralized_conversion_requests') {
          return Promise.resolve([
            {
              collateral_amount: '20.000 HIVE',
              conversion_date: '2023-01-02T00:00:00',
              id: 2,
              owner: 'user1',
              requestid: 2,
            },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await getConversionRequests('user1', 'HIVE');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item.amount.split(' ')[1]).toBe('HIVE');
      });
    });
  });
});
