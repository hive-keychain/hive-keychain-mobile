const mockDatabase = {
  getAccounts: jest.fn(),
};

const mockClient = {
  database: mockDatabase,
};

const mockGetData = jest.fn();
const mockBroadcast = jest.fn();

jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [] as any[],
      activeAccount: {name: 'user1'},
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(() => mockClient),
  broadcast: jest.fn((...args) => mockBroadcast(...args)),
  getData: jest.fn((...args) => mockGetData(...args)),
}));

jest.mock('utils/key.utils', () => ({
  KeyUtils: {
    hasKeys: jest.fn(),
    isExportable: jest.fn(() => true),
  },
}));

jest.mock('../config.utils', () => ({
  ClaimsConfig: {
    freeAccount: {
      MIN_RC_PCT: 85,
      MIN_RC: 9484331370472,
    },
  },
}));

import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import {Account, ActiveAccount, RC} from 'actions/interfaces';
import AccountUtils from '../account.utils';

describe('AccountUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRCMana', () => {
    it('should get RC mana with percentage calculation', async () => {
      const now = Date.now() / 1000;
      const mockData = {
        rc_accounts: [
          {
            rc_manabar: {
              current_mana: '500000',
              last_update_time: now - 100, // 100 seconds ago
            },
            max_rc: '1000000',
          },
        ],
      };
      mockGetData.mockResolvedValueOnce(mockData);
      const result = await AccountUtils.getRCMana('user1');
      expect(result).toBeDefined();
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
      expect(result.max_rc).toBe('1000000');
    });

    it('should cap percentage at 100', async () => {
      const now = Date.now() / 1000;
      const mockData = {
        rc_accounts: [
          {
            rc_manabar: {
              current_mana: '1000000',
              last_update_time: now - 100000, // Very old
            },
            max_rc: '1000000',
          },
        ],
      };
      mockGetData.mockResolvedValueOnce(mockData);
      const result = await AccountUtils.getRCMana('user1');
      expect(result.percentage).toBeLessThanOrEqual(100);
    });

    it('should set percentage to 0 if negative', async () => {
      const now = Date.now() / 1000;
      const mockData = {
        rc_accounts: [
          {
            rc_manabar: {
              current_mana: '-1000',
              last_update_time: now,
            },
            max_rc: '1000000',
          },
        ],
      };
      mockGetData.mockResolvedValueOnce(mockData);
      const result = await AccountUtils.getRCMana('user1');
      expect(result.percentage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('addAuthorizedAccount', () => {
    const mockSimpleToast = {
      show: jest.fn(),
      durations: {LONG: 3000},
    };

    beforeEach(() => {
      mockSimpleToast.show.mockClear();
    });

    it('should throw error if fields are empty', async () => {
      await expect(
        AccountUtils.addAuthorizedAccount('', 'auth', []),
      ).rejects.toThrow('Please fill the fields');
      await expect(
        AccountUtils.addAuthorizedAccount('user', '', []),
      ).rejects.toThrow('Please fill the fields');
    });

    it('should throw error if account already exists', async () => {
      const existingAccounts: Account[] = [{name: 'user1', keys: {}}];
      await expect(
        AccountUtils.addAuthorizedAccount('user1', 'auth', existingAccounts),
      ).rejects.toThrow();
    });

    it('should show toast and return when account already exists with toast', async () => {
      const existingAccounts: Account[] = [{name: 'user1', keys: {}}];
      const result = await AccountUtils.addAuthorizedAccount(
        'user1',
        'auth',
        existingAccounts,
        mockSimpleToast,
      );
      expect(mockSimpleToast.show).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should throw error if authorized account does not exist', async () => {
      const existingAccounts: Account[] = [{name: 'user1', keys: {}}];
      await expect(
        AccountUtils.addAuthorizedAccount('newuser', 'auth', existingAccounts),
      ).rejects.toThrow();
    });

    it('should return undefined when authorized account does not exist with toast', async () => {
      const existingAccounts: Account[] = [{name: 'user1', keys: {}}];
      const result = await AccountUtils.addAuthorizedAccount(
        'newuser',
        'auth',
        existingAccounts,
        mockSimpleToast,
      );
      expect(result).toBeUndefined();
    });

    it('should throw error if hive account does not exist', async () => {
      const existingAccounts: Account[] = [
        {name: 'authuser', keys: {active: 'key1'}},
      ];
      mockDatabase.getAccounts.mockResolvedValueOnce([]);
      await expect(
        AccountUtils.addAuthorizedAccount(
          'newuser',
          'authuser',
          existingAccounts,
        ),
      ).rejects.toThrow();
    });

    it('should return keys when account has active authorization', async () => {
      const existingAccounts: Account[] = [
        {
          name: 'authuser',
          keys: {active: 'activeKey', posting: 'postingKey'},
        },
      ];
      const mockHiveAccount = {
        name: 'newuser',
        active: {
          account_auths: [['authuser', 1]] as [string, number][],
          key_auths: [] as [string, number][],
        },
        posting: {
          account_auths: [] as [string, number][],
          key_auths: [] as [string, number][],
        },
      };
      mockDatabase.getAccounts.mockResolvedValueOnce([mockHiveAccount]);
      const result = await AccountUtils.addAuthorizedAccount(
        'newuser',
        'authuser',
        existingAccounts,
      );
      expect(result).toEqual({
        active: 'activeKey',
        activePubkey: '@authuser',
      });
    });

    it('should return keys when account has posting authorization', async () => {
      const existingAccounts: Account[] = [
        {
          name: 'authuser',
          keys: {active: 'activeKey', posting: 'postingKey'},
        },
      ];
      const mockHiveAccount = {
        name: 'newuser',
        active: {
          account_auths: [] as [string, number][],
          key_auths: [] as [string, number][],
        },
        posting: {
          account_auths: [['authuser', 1]] as [string, number][],
          key_auths: [] as [string, number][],
        },
      };
      mockDatabase.getAccounts.mockResolvedValueOnce([mockHiveAccount]);
      const result = await AccountUtils.addAuthorizedAccount(
        'newuser',
        'authuser',
        existingAccounts,
      );
      expect(result).toEqual({
        posting: 'postingKey',
        postingPubkey: '@authuser',
      });
    });

    it('should return both keys when account has both active and posting authorization', async () => {
      const existingAccounts: Account[] = [
        {
          name: 'authuser',
          keys: {active: 'activeKey', posting: 'postingKey'},
        },
      ];
      const mockHiveAccount = {
        name: 'newuser',
        active: {
          account_auths: [['authuser', 1]] as [string, number][],
          key_auths: [] as [string, number][],
        },
        posting: {
          account_auths: [['authuser', 1]] as [string, number][],
          key_auths: [] as [string, number][],
        },
      };
      mockDatabase.getAccounts.mockResolvedValueOnce([mockHiveAccount]);
      const result = await AccountUtils.addAuthorizedAccount(
        'newuser',
        'authuser',
        existingAccounts,
      );
      expect(result).toEqual({
        active: 'activeKey',
        activePubkey: '@authuser',
        posting: 'postingKey',
        postingPubkey: '@authuser',
      });
    });

    it('should throw error if no authorization found', async () => {
      const existingAccounts: Account[] = [
        {
          name: 'authuser',
          keys: {active: 'activeKey', posting: 'postingKey'},
        },
      ];
      const mockHiveAccount = {
        name: 'newuser',
        active: {
          account_auths: [] as [string, number][],
          key_auths: [] as [string, number][],
        },
        posting: {
          account_auths: [] as [string, number][],
          key_auths: [] as [string, number][],
        },
      };
      mockDatabase.getAccounts.mockResolvedValueOnce([mockHiveAccount]);
      await expect(
        AccountUtils.addAuthorizedAccount(
          'newuser',
          'authuser',
          existingAccounts,
        ),
      ).rejects.toThrow();
    });

    it('should return undefined if no authorization found with toast', async () => {
      const existingAccounts: Account[] = [
        {
          name: 'authuser',
          keys: {active: 'activeKey', posting: 'postingKey'},
        },
      ];
      const mockHiveAccount = {
        name: 'newuser',
        active: {
          account_auths: [] as [string, number][],
          key_auths: [] as [string, number][],
        },
        posting: {
          account_auths: [] as [string, number][],
          key_auths: [] as [string, number][],
        },
      };
      mockDatabase.getAccounts.mockResolvedValueOnce([mockHiveAccount]);
      const result = await AccountUtils.addAuthorizedAccount(
        'newuser',
        'authuser',
        existingAccounts,
        mockSimpleToast,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getAccount', () => {
    it('should get account', async () => {
      const mockAccount = {name: 'user1'};
      mockDatabase.getAccounts.mockResolvedValue([mockAccount]);
      const result = await AccountUtils.getAccount('user1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockAccount);
      expect(mockDatabase.getAccounts).toHaveBeenCalledWith(['user1']);
    });

    it('should return empty array when account does not exist', async () => {
      mockDatabase.getAccounts.mockResolvedValue([]);
      const result = await AccountUtils.getAccount('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('getAccounts', () => {
    it('should get multiple accounts', async () => {
      const mockAccounts = [{name: 'user1'}, {name: 'user2'}, {name: 'user3'}];
      mockDatabase.getAccounts.mockResolvedValue(mockAccounts);
      const result = await AccountUtils.getAccounts([
        'user1',
        'user2',
        'user3',
      ]);
      expect(result).toEqual(mockAccounts);
      expect(mockDatabase.getAccounts).toHaveBeenCalledWith([
        'user1',
        'user2',
        'user3',
      ]);
    });

    it('should handle empty array', async () => {
      mockDatabase.getAccounts.mockResolvedValue([]);
      const result = await AccountUtils.getAccounts([]);
      expect(result).toEqual([]);
      expect(mockDatabase.getAccounts).toHaveBeenCalledWith([]);
    });
  });

  describe('doesAccountExist', () => {
    it('should return true when account exists', async () => {
      mockDatabase.getAccounts.mockResolvedValue([{name: 'user1'}]);
      const result = await AccountUtils.doesAccountExist('user1');
      expect(result).toBe(true);
    });

    it('should return false when account does not exist', async () => {
      mockDatabase.getAccounts.mockResolvedValue([]);
      const result = await AccountUtils.doesAccountExist('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('claimAccounts', () => {
    const mockActiveAccount: ActiveAccount = {
      name: 'user1',
      account: {} as any,
      keys: {active: 'activeKey'},
      rc: {
        percentage: 90,
        current_mana: '10000000000',
        max_mana: '10000000000',
        rc_manabar: {
          current_mana: '10000000000',
          last_update_time: Date.now() / 1000,
        },
        delegated_rc: 0,
        received_delegated_rc: 0,
        max_rc: 10000000000000,
      } as unknown as RC,
    } as ActiveAccount;

    const mockRC: RC = {
      current_mana: '10000000000000',
      max_mana: '10000000000000',
      rc_manabar: {
        current_mana: '10000000000000',
        last_update_time: Date.now() / 1000,
      },
      delegated_rc: 0,
      received_delegated_rc: 0,
      max_rc: 10000000000000,
      percentage: 90,
    } as unknown as RC;

    it('should claim account when RC percentage and mana are sufficient', async () => {
      mockBroadcast.mockResolvedValueOnce({success: true});
      const result = await AccountUtils.claimAccounts(
        mockRC,
        mockActiveAccount,
      );
      expect(mockBroadcast).toHaveBeenCalledWith('activeKey', [
        [
          'claim_account',
          {
            creator: 'user1',
            extensions: [],
            fee: '0.000 HIVE',
          },
        ],
      ]);
      expect(result).toEqual({success: true});
    });

    it('should not claim account when RC percentage is too low', async () => {
      const lowRCAccount: ActiveAccount = {
        ...mockActiveAccount,
        rc: {
          percentage: 50,
          current_mana: '10000000000',
          max_mana: '10000000000',
          rc_manabar: {
            current_mana: '10000000000',
            last_update_time: Date.now() / 1000,
          },
          delegated_rc: 0,
          received_delegated_rc: 0,
          max_rc: 10000000000000,
        } as unknown as RC,
      };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await AccountUtils.claimAccounts(mockRC, lowRCAccount);
      expect(mockBroadcast).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Not enough RC% to claim account',
      );
      consoleSpy.mockRestore();
    });

    it('should not claim account when RC mana is too low', async () => {
      const lowManaRC: RC = {
        current_mana: '1000',
        max_mana: '10000000000000',
        rc_manabar: {
          current_mana: '1000',
          last_update_time: Date.now() / 1000,
        },
        delegated_rc: 0,
        received_delegated_rc: 0,
        max_rc: 10000000000000,
        percentage: 90,
      } as unknown as RC;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await AccountUtils.claimAccounts(lowManaRC, mockActiveAccount);
      expect(mockBroadcast).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Not enough RC% to claim account',
      );
      consoleSpy.mockRestore();
    });
  });

  describe('getPowerDown', () => {
    it('should calculate power down values correctly', () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        withdrawn: 5000000,
        to_withdraw: 10000000,
        next_vesting_withdrawal: '2024-01-01T00:00:00',
      } as unknown as ExtendedAccount;

      const mockGlobalProperties: DynamicGlobalProperties = {
        total_vesting_fund_hive: '1000000.000 HIVE',
        total_vesting_shares: '1000000000.000000 VESTS',
      } as DynamicGlobalProperties;

      const result = AccountUtils.getPowerDown(
        mockAccount,
        mockGlobalProperties,
      );
      expect(result).toHaveProperty('withdrawn');
      expect(result).toHaveProperty('total_withdrawing');
      expect(result).toHaveProperty('next_vesting_withdrawal');
      expect(result.next_vesting_withdrawal).toBe('2024-01-01T00:00:00');
      expect(typeof result.withdrawn).toBe('string');
      expect(typeof result.total_withdrawing).toBe('string');
    });

    it('should handle zero values', () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        withdrawn: 0,
        to_withdraw: 0,
        next_vesting_withdrawal: '2024-01-01T00:00:00',
      } as unknown as ExtendedAccount;

      const mockGlobalProperties: DynamicGlobalProperties = {
        total_vesting_fund_hive: '1000000.000 HIVE',
        total_vesting_shares: '1000000000.000000 VESTS',
      } as DynamicGlobalProperties;

      const result = AccountUtils.getPowerDown(
        mockAccount,
        mockGlobalProperties,
      );
      expect(result.withdrawn).toBe('0.000');
      expect(result.total_withdrawing).toBe('0.000');
    });
  });

  describe('generateQRCode', () => {
    it('should generate QR code JSON string from ActiveAccount', () => {
      const mockAccount: ActiveAccount = {
        name: 'user1',
        keys: {
          active: 'activeKey',
          posting: 'postingKey',
          memo: 'memoKey',
        },
      } as ActiveAccount;

      const result = AccountUtils.generateQRCode(mockAccount);
      expect(typeof result).toBe('string');
      const parsed = JSON.parse(result);
      expect(parsed.name).toBe('user1');
      expect(parsed.keys).toEqual(mockAccount.keys);
    });

    it('should handle account with empty keys', () => {
      const mockAccount: ActiveAccount = {
        name: 'user1',
        keys: {},
      } as ActiveAccount;

      const result = AccountUtils.generateQRCode(mockAccount);
      const parsed = JSON.parse(result);
      expect(parsed.keys).toEqual({});
    });
  });

  describe('generateQRCodeFromAccount', () => {
    beforeEach(() => {
      const {KeyUtils} = require('../key.utils');
      KeyUtils.isExportable.mockReturnValue(true);
    });

    it('should generate account with exportable keys', () => {
      const mockAccount: Account = {
        name: 'user1',
        keys: {
          active: 'activeKey',
          activePubkey: '@authuser',
          posting: 'postingKey',
          postingPubkey: '@authuser',
          memo: 'memoKey',
          memoPubkey: 'STMmemo',
        },
      };

      const result = AccountUtils.generateQRCodeFromAccount(mockAccount);
      expect(result.name).toBe('user1');
      expect(result.keys.active).toBe('activeKey');
      expect(result.keys.activePubkey).toBe('@authuser');
      expect(result.keys.posting).toBe('postingKey');
      expect(result.keys.postingPubkey).toBe('@authuser');
      expect(result.keys.memo).toBe('memoKey');
      expect(result.keys.memoPubkey).toBe('STMmemo');
    });

    it('should exclude non-exportable keys', () => {
      const {KeyUtils} = require('../key.utils');
      KeyUtils.isExportable.mockImplementation(
        (key: string, pubkey?: string) => {
          // Only memo is exportable
          return pubkey === 'STMmemo';
        },
      );

      const mockAccount: Account = {
        name: 'user1',
        keys: {
          active: 'activeKey',
          activePubkey: '@authuser',
          posting: 'postingKey',
          postingPubkey: '@authuser',
          memo: 'memoKey',
          memoPubkey: 'STMmemo',
        },
      };

      const result = AccountUtils.generateQRCodeFromAccount(mockAccount);
      expect(result.keys.active).toBeUndefined();
      expect(result.keys.posting).toBeUndefined();
      expect(result.keys.memo).toBe('memoKey');
      expect(result.keys.memoPubkey).toBe('STMmemo');
    });

    it('should exclude activePubkey if it does not start with @', () => {
      const mockAccount: Account = {
        name: 'user1',
        keys: {
          active: 'activeKey',
          activePubkey: 'STMactive',
          posting: 'postingKey',
          postingPubkey: '@authuser',
        },
      };

      const result = AccountUtils.generateQRCodeFromAccount(mockAccount);
      expect(result.keys.active).toBe('activeKey');
      expect(result.keys.activePubkey).toBeUndefined();
      expect(result.keys.posting).toBe('postingKey');
      expect(result.keys.postingPubkey).toBe('@authuser');
    });

    it('should handle account with no keys', () => {
      const mockAccount: Account = {
        name: 'user1',
        keys: {},
      };

      const result = AccountUtils.generateQRCodeFromAccount(mockAccount);
      expect(result.name).toBe('user1');
      expect(result.keys).toEqual({});
    });
  });
});
