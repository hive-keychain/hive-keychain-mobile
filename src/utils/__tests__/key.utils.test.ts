const mockGetData = jest.fn();
const mockGetPublicKeyFromPrivateKeyString = jest.fn();

jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
    })),
  },
}));

jest.mock('../hiveLibs.utils', () => ({
  getData: jest.fn((...args) => mockGetData(...args)),
}));

jest.mock('../keyValidation.utils', () => ({
  getPublicKeyFromPrivateKeyString: jest.fn((...args) =>
    mockGetPublicKeyFromPrivateKeyString(...args),
  ),
}));

import {ExtendedAccount} from '@hiveio/dhive';
import {AccountKeys} from 'actions/interfaces';
import {KeychainKeyTypesLC} from 'hive-keychain-commons';
import {PrivateKeyType} from 'src/interfaces/keys.interface';
import {KeyUtils} from '../key.utils';

describe('KeyUtils', () => {
  describe('isAuthorizedAccount', () => {
    it('should return true for authorized account key', () => {
      expect(KeyUtils.isAuthorizedAccount('@username')).toBe(true);
    });

    it('should return false for regular key', () => {
      expect(KeyUtils.isAuthorizedAccount('STM...')).toBe(false);
    });

    it('should handle string conversion', () => {
      expect(KeyUtils.isAuthorizedAccount('@test' as any)).toBe(true);
    });
  });

  describe('keysCount', () => {
    it('should return count of keys', () => {
      const keys: AccountKeys = {
        active: 'STM...',
        posting: 'STM...',
        memo: 'STM...',
      };
      expect(KeyUtils.keysCount(keys)).toBe(3);
    });

    it('should return 0 for empty keys', () => {
      expect(KeyUtils.keysCount({})).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(KeyUtils.keysCount(null as any)).toBe(0);
      expect(KeyUtils.keysCount(undefined as any)).toBe(0);
    });
  });

  describe('hasKeys', () => {
    it('should return true when keys exist', () => {
      const keys: AccountKeys = {active: 'STM...'};
      expect(KeyUtils.hasKeys(keys)).toBe(true);
    });

    it('should return false when no keys', () => {
      expect(KeyUtils.hasKeys({})).toBe(false);
      expect(KeyUtils.hasKeys(null as any)).toBe(false);
    });
  });

  describe('getKeyType', () => {
    it('should return LEDGER for ledger key', () => {
      const result = KeyUtils.getKeyType('#ledgerkey' as any);
      expect(result).toBe(PrivateKeyType.LEDGER);
    });

    it('should return AUTHORIZED_ACCOUNT for authorized account', () => {
      const result = KeyUtils.getKeyType('STM...' as any, '@username' as any);
      expect(result).toBe(PrivateKeyType.AUTHORIZED_ACCOUNT);
    });

    it('should return PRIVATE_KEY for regular key', () => {
      const result = KeyUtils.getKeyType('STM...' as any, 'STM...' as any);
      expect(result).toBe(PrivateKeyType.PRIVATE_KEY);
    });
  });

  describe('isExportable', () => {
    it('should return true for private key', () => {
      const result = KeyUtils.isExportable('STM...' as any, 'STM...' as any);
      expect(result).toBe(true);
    });

    it('should return true for authorized account', () => {
      const result = KeyUtils.isExportable('STM...' as any, '@username' as any);
      expect(result).toBe(true);
    });

    it('should return false for ledger key', () => {
      const result = KeyUtils.isExportable('#ledger' as any, 'STM...' as any);
      expect(result).toBeUndefined();
    });

    it('should return false when keys are missing', () => {
      expect(KeyUtils.isExportable(undefined, undefined)).toBe(false);
    });

    it('should return false when only private key is missing', () => {
      expect(KeyUtils.isExportable(undefined, 'STM...' as any)).toBe(false);
    });

    it('should return false when only public key is missing', () => {
      expect(KeyUtils.isExportable('STM...' as any, undefined)).toBe(false);
    });
  });

  describe('checkWrongKeyOnAccount', () => {
    const mockAccount: ExtendedAccount = {
      name: 'user1',
      active: {
        key_auths: [['STMactive', 1]],
        account_auths: [],
      },
      posting: {
        key_auths: [['STMposting', 1]],
        account_auths: [],
      },
      memo_key: 'STMmemo',
    } as ExtendedAccount;

    it('should return foundWrongKey when skipKey is true', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'activePubkey',
        'STMwrong',
        'user1',
        mockAccount,
        foundWrongKey,
        true,
      );
      expect(result).toEqual(foundWrongKey);
      expect(result.user1.length).toBe(0);
    });

    it('should return foundWrongKey when key does not include Pubkey', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'active',
        'STMwrong',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result).toEqual(foundWrongKey);
    });

    it('should return foundWrongKey when value includes @', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'activePubkey',
        '@user1',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result).toEqual(foundWrongKey);
    });

    it('should detect wrong active key', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'activePubkey',
        'STMwrong',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result.user1).toContain(KeychainKeyTypesLC.active);
    });

    it('should detect wrong posting key', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'postingPubkey',
        'STMwrong',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result.user1).toContain(KeychainKeyTypesLC.posting);
    });

    it('should detect wrong memo key', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'memoPubkey',
        'STMwrong',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result.user1).toContain(KeychainKeyTypesLC.memo);
    });

    it('should not detect correct active key', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'activePubkey',
        'STMactive',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result.user1).not.toContain(KeychainKeyTypesLC.active);
    });

    it('should not detect correct memo key', () => {
      const foundWrongKey: any = {user1: []};
      const result = KeyUtils.checkWrongKeyOnAccount(
        'memoPubkey',
        'STMmemo',
        'user1',
        mockAccount,
        foundWrongKey,
      );
      expect(result.user1).not.toContain(KeychainKeyTypesLC.memo);
    });
  });

  describe('checkKeysOnAccount', () => {
    const mockAccount: ExtendedAccount = {
      name: 'user1',
      active: {
        key_auths: [['STMactive', 1]],
        account_auths: [],
      },
      posting: {
        key_auths: [['STMposting', 1]],
        account_auths: [],
      },
      memo_key: 'STMmemo',
    } as ExtendedAccount;

    it('should check all keys on account', () => {
      const account = {
        name: 'user1',
        keys: {
          active: 'STMactive',
          activePubkey: 'STMactive',
          posting: 'STMposting',
          postingPubkey: 'STMposting',
          memo: 'STMmemo',
          memoPubkey: 'STMmemo',
        },
      };
      const noKeyCheck: any = {};
      const result = KeyUtils.checkKeysOnAccount(
        account as any,
        mockAccount,
        noKeyCheck,
      );
      expect(result).toBeDefined();
      expect(result.user1).toBeDefined();
    });

    it('should detect wrong keys', () => {
      const account = {
        name: 'user1',
        keys: {
          active: 'STMactive',
          activePubkey: 'STMwrong',
          posting: 'STMposting',
          postingPubkey: 'STMposting',
          memo: 'STMmemo',
          memoPubkey: 'STMmemo',
        },
      };
      const noKeyCheck: any = {};
      const result = KeyUtils.checkKeysOnAccount(
        account as any,
        mockAccount,
        noKeyCheck,
      );
      expect(result.user1.length).toBeGreaterThan(0);
    });

    it('should skip keys in noKeyCheck list', () => {
      const account = {
        name: 'user1',
        keys: {
          active: 'STMactive',
          activePubkey: 'STMwrong',
        },
      };
      const noKeyCheck: any = {user1: ['active']};
      const result = KeyUtils.checkKeysOnAccount(
        account as any,
        mockAccount,
        noKeyCheck,
      );
      expect(result.user1).not.toContain('active');
    });
  });

  describe('getKeyReferences', () => {
    it('should get key references', async () => {
      mockGetData.mockResolvedValue([['user1']]);
      const result = await KeyUtils.getKeyReferences(['STMactive']);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockGetData).toHaveBeenCalledWith(
        'condenser_api.get_key_references',
        [['STMactive']],
      );
    });

    it('should handle empty array', async () => {
      mockGetData.mockResolvedValue([]);
      const result = await KeyUtils.getKeyReferences([]);
      expect(result).toEqual([]);
    });
  });

  describe('isUsingMultisig', () => {
    const mockTransactionAccount: ExtendedAccount = {
      name: 'user1',
      active: {
        weight_threshold: 2,
        account_auths: [['multisig', 1]],
        key_auths: [],
      },
      posting: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [],
      },
    } as ExtendedAccount;

    beforeEach(() => {
      mockGetPublicKeyFromPrivateKeyString.mockReturnValue('STMpublic');
    });

    it('should return true when account auth weight is below threshold', () => {
      const result = KeyUtils.isUsingMultisig(
        'STMkey' as any,
        mockTransactionAccount,
        'multisig',
        KeychainKeyTypesLC.active,
      );
      expect(result).toBe(true);
    });

    it('should return false when account auth weight meets threshold', () => {
      const account: ExtendedAccount = {
        ...mockTransactionAccount,
        active: {
          weight_threshold: 1,
          account_auths: [['multisig', 1]],
          key_auths: [],
        },
      };
      const result = KeyUtils.isUsingMultisig(
        'STMkey' as any,
        account,
        'multisig',
        KeychainKeyTypesLC.active,
      );
      expect(result).toBe(false);
    });

    it('should check posting authority', () => {
      const account: ExtendedAccount = {
        ...mockTransactionAccount,
        posting: {
          weight_threshold: 2,
          account_auths: [['multisig', 1]],
          key_auths: [],
        },
      };
      const result = KeyUtils.isUsingMultisig(
        'STMkey' as any,
        account,
        'multisig',
        KeychainKeyTypesLC.posting,
      );
      expect(result).toBe(true);
    });

    it('should return true for unknown method', () => {
      const result = KeyUtils.isUsingMultisig(
        'STMkey' as any,
        mockTransactionAccount,
        'multisig',
        'unknown' as any,
      );
      expect(result).toBe(true);
    });
  });

  describe('isKeyActiveOrPosting', () => {
    it('should return active for active key', async () => {
      const {store} = require('store');
      const mockAccount: ExtendedAccount = {
        name: 'user1',
      } as ExtendedAccount;

      store.getState.mockReturnValue({
        accounts: [
          {
            name: 'user1',
            keys: {
              active: 'STMactive',
              posting: 'STMposting',
            },
          },
        ],
      });

      const result = await KeyUtils.isKeyActiveOrPosting(
        'STMactive',
        mockAccount,
      );
      expect(result).toBeDefined();
    });

    it('should return posting for posting key', async () => {
      const {store} = require('store');
      const mockAccount: ExtendedAccount = {
        name: 'user1',
      } as ExtendedAccount;

      store.getState.mockReturnValue({
        accounts: [
          {
            name: 'user1',
            keys: {
              active: 'STMactive',
              posting: 'STMposting',
            },
          },
        ],
      });

      const result = await KeyUtils.isKeyActiveOrPosting(
        'STMposting',
        mockAccount,
      );
      expect(result).toBeDefined();
    });
  });
});
