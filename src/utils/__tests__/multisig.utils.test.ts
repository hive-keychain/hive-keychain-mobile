jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
  __esModule: true,
}));

const mockGetAccounts = jest.fn();
const mockGetClient = jest.fn(() => ({
  database: {
    getAccounts: mockGetAccounts,
  },
}));

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: (...args: any[]) => mockGetClient(...args),
}));

const mockIsUsingMultisig = jest.fn(() => false);
const mockGetKeyType = jest.fn();
const mockIsKeyActiveOrPosting = jest.fn();

jest.mock('utils/key.utils', () => ({
  KeyUtils: {
    getKeyType: (...args: any[]) => mockGetKeyType(...args),
    isKeyActiveOrPosting: (...args: any[]) => mockIsKeyActiveOrPosting(...args),
    isUsingMultisig: (...args: any[]) => mockIsUsingMultisig(...args),
  },
}));

const mockEncodeMemo = jest.fn();
const mockDecodeMemo = jest.fn();

jest.mock('components/bridge', () => ({
  encodeMemo: (...args: any[]) => mockEncodeMemo(...args),
  decodeMemo: (...args: any[]) => mockDecodeMemo(...args),
}));

const mockGetPublicKeyFromPrivateKeyString = jest.fn();

jest.mock('utils/keyValidation.utils', () => ({
  getPublicKeyFromPrivateKeyString: (...args: any[]) =>
    mockGetPublicKeyFromPrivateKeyString(...args),
}));

import {MultisigUtils} from '../multisig.utils';
import {getClient} from 'utils/hiveLibs.utils';
import {KeyTypes, ActiveAccount} from 'actions/interfaces';
import {ExtendedAccount} from '@hiveio/dhive';
import {KeychainKeyTypes} from 'hive-keychain-commons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';

describe('MultisigUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsUsingMultisig.mockReturnValue(false);
    mockGetPublicKeyFromPrivateKeyString.mockReturnValue('STMpublickey');
  });

  describe('getMultisigInfo', () => {
    it('should get multisig info for active account', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          active: 'STM...',
          activePubkey: 'STMactive',
        },
        account: {
          name: 'user1',
          active: {
            account_auths: [['multisig1', 1]],
            key_auths: [],
            weight_threshold: 1,
          },
          posting: {
            account_auths: [],
            key_auths: [['STM...', 1]],
            weight_threshold: 1,
          },
        } as ExtendedAccount,
      };
      mockIsUsingMultisig.mockReturnValue(true);
      mockGetAccounts.mockResolvedValue([
        {
          name: 'multisig1',
          json_metadata: JSON.stringify({isMultisigBot: true}),
        },
      ]);
      const result = await MultisigUtils.getMultisigInfo(
        KeyTypes.active,
        mockAccount as ActiveAccount,
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe(true);
    });

    it('should get multisig info for posting account', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          posting: 'STM...',
          postingPubkey: 'STMposting',
        },
        account: {
          name: 'user1',
          active: {
            account_auths: [],
            key_auths: [['STM...', 1]],
            weight_threshold: 1,
          },
          posting: {
            account_auths: [['multisig1', 1]],
            key_auths: [],
            weight_threshold: 1,
          },
        } as ExtendedAccount,
      };
      mockIsUsingMultisig.mockReturnValue(true);
      mockGetAccounts.mockResolvedValue([
        {
          name: 'multisig1',
          json_metadata: JSON.stringify({isMultisigBot: true}),
        },
      ]);
      const result = await MultisigUtils.getMultisigInfo(
        KeyTypes.posting,
        mockAccount as ActiveAccount,
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe(true);
    });

    it('should return false for non-multisig account', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          active: 'STM...',
        },
        account: {
          name: 'user1',
          active: {
            account_auths: [],
            key_auths: [['STM...', 1]],
            weight_threshold: 1,
          },
        } as ExtendedAccount,
      };
      const result = await MultisigUtils.getMultisigInfo(
        KeyTypes.active,
        mockAccount as ActiveAccount,
      );
      expect(result[0]).toBe(false);
    });

    it('should handle account with @ prefix in pubkey', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          active: 'STM...',
          activePubkey: '@multisig1',
        },
        account: {
          name: 'user1',
          active: {
            account_auths: [['multisig1', 1]],
            key_auths: [],
            weight_threshold: 1,
          },
        } as ExtendedAccount,
      };
      mockIsUsingMultisig.mockReturnValue(true);
      mockGetAccounts.mockResolvedValue([
        {
          name: 'multisig1',
          json_metadata: JSON.stringify({isMultisigBot: true}),
        },
      ]);
      const result = await MultisigUtils.getMultisigInfo(
        KeyTypes.active,
        mockAccount as ActiveAccount,
      );
      expect(result).toBeDefined();
    });
  });

  describe('get2FAAccounts', () => {
    it('should get 2FA accounts for active authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        active: {
          account_auths: [['bot1', 1], ['bot2', 1]],
          key_auths: [],
          weight_threshold: 1,
        },
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        json_metadata: '{}',
      } as ExtendedAccount;
      mockGetAccounts.mockResolvedValue([
        {
          name: 'bot1',
          json_metadata: JSON.stringify({isMultisigBot: true}),
        },
        {
          name: 'bot2',
          json_metadata: JSON.stringify({isMultisigBot: false}),
        },
      ]);
      const result = await MultisigUtils.get2FAAccounts(
        mockAccount,
        KeychainKeyTypes.active,
      );
      expect(result).toEqual(['bot1']);
    });

    it('should get 2FA accounts for posting authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        posting: {
          account_auths: [['bot1', 1]],
          key_auths: [],
          weight_threshold: 1,
        },
        json_metadata: '{}',
      } as ExtendedAccount;
      mockGetAccounts.mockResolvedValue([
        {
          name: 'bot1',
          json_metadata: JSON.stringify({isMultisigBot: true}),
        },
      ]);
      const result = await MultisigUtils.get2FAAccounts(
        mockAccount,
        KeychainKeyTypes.posting,
      );
      expect(result).toEqual(['bot1']);
    });

    it('should return empty array when no bots found', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        json_metadata: '{}',
      } as ExtendedAccount;
      // Mock getAccounts to return empty array since there are no account_auths
      mockGetAccounts.mockResolvedValueOnce([]);
      const result = await MultisigUtils.get2FAAccounts(
        mockAccount,
        KeychainKeyTypes.active,
      );
      expect(result).toEqual([]);
    });
  });

  describe('getUsernameFromTransaction', () => {
    it('should extract username from transfer operation', () => {
      const tx = {
        operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('user1');
    });

    it('should extract username from account_create operation', () => {
      const tx = {
        operations: [
          [
            'account_create',
            {
              creator: 'creator1',
              new_account_name: 'newuser',
              fee: '3.000 HIVE',
            },
          ],
        ],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('creator1');
    });

    it('should extract username from account_update operation', () => {
      const tx = {
        operations: [['account_update', {account: 'user1'}]],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('user1');
    });

    it('should extract username from vote operation', () => {
      const tx = {
        operations: [
          ['vote', {voter: 'voter1', author: 'author1', permlink: 'post1'}],
        ],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('voter1');
    });

    it('should extract username from delegate_vesting_shares operation', () => {
      const tx = {
        operations: [
          [
            'delegate_vesting_shares',
            {
              delegator: 'delegator1',
              delegatee: 'delegatee1',
              vesting_shares: '100 VESTS',
            },
          ],
        ],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('delegator1');
    });

    it('should extract username from custom_json operation', () => {
      const tx = {
        operations: [
          [
            'custom_json',
            {
              required_auths: ['user1'],
              required_posting_auths: [],
              id: 'test',
              json: '{}',
            },
          ],
        ],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('user1');
    });

    it('should return undefined for empty operations', () => {
      const tx = {operations: []};
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid operation format', () => {
      const tx = {operations: [['invalid', 'not an object']]};
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBeUndefined();
    });

    it('should handle multiple operations with same username', () => {
      const tx = {
        operations: [
          ['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}],
          ['transfer', {from: 'user1', to: 'user4', amount: '2 HIVE'}],
        ],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBe('user1');
    });

    it('should return undefined when operations have different usernames', () => {
      const tx = {
        operations: [
          ['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}],
          ['vote', {voter: 'user3', author: 'author1', permlink: 'post1'}],
        ],
      };
      const result = MultisigUtils.getUsernameFromTransaction(tx as any);
      expect(result).toBeUndefined();
    });
  });

  describe('saveMultisigConfig', () => {
    it('should save multisig config for account', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const config = {
        threshold: 2,
        signers: ['signer1', 'signer2'],
      };
      await MultisigUtils.saveMultisigConfig('user1', config as any);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should merge with existing config', async () => {
      const existingConfig = JSON.stringify({
        user2: {threshold: 1, signers: ['signer1']},
      });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(existingConfig);
      const config = {
        threshold: 2,
        signers: ['signer1', 'signer2'],
      };
      await MultisigUtils.saveMultisigConfig('user1', config as any);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.MULTISIG_CONFIG,
        expect.stringContaining('user1'),
      );
    });
  });

  describe('getMultisigAccountConfig', () => {
    it('should get multisig config for account', async () => {
      const config = {
        user1: {threshold: 2, signers: ['signer1', 'signer2']},
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(config));
      const result = await MultisigUtils.getMultisigAccountConfig('user1');
      expect(result).toEqual({threshold: 2, signers: ['signer1', 'signer2']});
    });

    it('should return null when config does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await MultisigUtils.getMultisigAccountConfig('user1');
      expect(result).toBeNull();
    });

    it('should return null when account config does not exist', async () => {
      const config = {
        user2: {threshold: 2, signers: ['signer1', 'signer2']},
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(config));
      const result = await MultisigUtils.getMultisigAccountConfig('user1');
      expect(result).toBeUndefined();
    });
  });

  describe('encodeTransaction', () => {
    it('should encode transaction', async () => {
      mockEncodeMemo.mockResolvedValue('encoded_memo');
      const transaction = {operations: []};
      const result = await MultisigUtils.encodeTransaction(
        transaction,
        'private_key',
        'public_key',
      );
      expect(mockEncodeMemo).toHaveBeenCalledWith(
        'private_key',
        'public_key',
        expect.stringContaining('#'),
      );
      expect(result).toBe('encoded_memo');
    });
  });

  describe('encodeMetadata', () => {
    it('should encode metadata', async () => {
      mockEncodeMemo.mockResolvedValue('encoded_metadata');
      const metadata = {test: 'data'};
      const result = await MultisigUtils.encodeMetadata(
        metadata,
        'private_key',
        'public_key',
      );
      expect(mockEncodeMemo).toHaveBeenCalledWith(
        'private_key',
        'public_key',
        expect.stringContaining('#'),
      );
      expect(result).toBe('encoded_metadata');
    });
  });

  describe('decodeTransaction', () => {
    it('should decode transaction', async () => {
      const encodedTx = JSON.stringify({operations: []});
      mockDecodeMemo.mockResolvedValue(`#${encodedTx}`);
      const result = await MultisigUtils.decodeTransaction(
        'encoded_message',
        'private_key',
      );
      expect(mockDecodeMemo).toHaveBeenCalledWith('private_key', 'encoded_message');
      expect(result).toEqual({operations: []});
    });

    it('should return undefined on decode error', async () => {
      mockDecodeMemo.mockRejectedValue(new Error('Decode error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await MultisigUtils.decodeTransaction(
        'encoded_message',
        'private_key',
      );
      expect(result).toBeUndefined();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getPotentialSigners', () => {
    it('should get potential signers for active authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        active: {
          account_auths: [['signer1', 1]],
          key_auths: [['STMkey1', 1], ['STMkey2', 1]],
          weight_threshold: 2,
        },
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
      } as ExtendedAccount;
      mockGetAccounts.mockResolvedValue([
        {
          name: 'signer1',
          active: {
            key_auths: [['STMsigner1', 1]],
          },
        },
      ]);
      mockGetPublicKeyFromPrivateKeyString.mockReturnValue('STMkey1');
      const result = await MultisigUtils.getPotentialSigners(
        mockAccount,
        'private_key' as any,
        KeychainKeyTypes.active,
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // Should exclude the key that matches the private key
      expect(result.some((r) => r[0] === 'STMkey1')).toBe(false);
    });

    it('should get potential signers for posting authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        posting: {
          account_auths: [['signer1', 1]],
          key_auths: [['STMkey1', 1]],
          weight_threshold: 1,
        },
      } as ExtendedAccount;
      mockGetAccounts.mockResolvedValue([
        {
          name: 'signer1',
          posting: {
            key_auths: [['STMsigner1', 1]],
          },
        },
      ]);
      mockGetPublicKeyFromPrivateKeyString.mockReturnValue('STMother');
      const result = await MultisigUtils.getPotentialSigners(
        mockAccount,
        'private_key' as any,
        KeychainKeyTypes.posting,
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        active: undefined as any,
        posting: undefined as any,
      } as ExtendedAccount;
      const result = await MultisigUtils.getPotentialSigners(
        mockAccount,
        'private_key' as any,
        KeychainKeyTypes.active,
      );
      expect(result).toEqual([]);
    });
  });
});
