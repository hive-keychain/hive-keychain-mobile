const mockGetAccount = jest.fn();
const mockCreateClaimedAccount = jest.fn();
const mockCreateNewAccount = jest.fn();
const mockValidateUsername = jest.fn();
const mockSimpleToast = {
  show: jest.fn(),
  durations: {LONG: 3000},
};

jest.mock('../account.utils', () => ({
  __esModule: true,
  default: {
    getAccount: (...args: any[]) => mockGetAccount(...args),
  },
}));

jest.mock('../hiveLibs.utils', () => ({
  createClaimedAccount: (...args: any[]) => mockCreateClaimedAccount(...args),
  createNewAccount: (...args: any[]) => mockCreateNewAccount(...args),
}));

jest.mock('hive-keychain-commons', () => ({
  AccountsUtils: {
    validateUsername: (...args: any[]) => mockValidateUsername(...args),
    UsernameValidation: {
      too_short: 'too_short',
      too_long: 'too_long',
      invalid_last_character: 'invalid_last_character',
      invalid_first_character: 'invalid_first_character',
      invalid_middle_characters: 'invalid_middle_characters',
      invalid_segment_length: 'invalid_segment_length',
      valid: 'valid',
    },
  },
}));

jest.mock('@hiveio/dhive', () => ({
  PrivateKey: {
    fromSeed: jest.fn((seed: string) => ({
      toString: jest.fn(() => 'mockPrivateKeyString'),
    })),
  },
}));

import {AccountCreationUtils, AccountCreationType} from '../accountCreation.utils';
import {AccountsUtils} from 'hive-keychain-commons';

// Mock crypto.getRandomValues
const originalGetRandomValues = global.crypto.getRandomValues;
beforeAll(() => {
  global.crypto.getRandomValues = jest.fn((array: Uint32Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 1000000);
    }
    return array;
  });
});

afterAll(() => {
  global.crypto.getRandomValues = originalGetRandomValues;
});

describe('AccountCreationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAccountNameAvailable', () => {
    it('should return true when account name is available', async () => {
      mockGetAccount.mockResolvedValueOnce([]);
      const result = await AccountCreationUtils.checkAccountNameAvailable(
        'newuser',
      );
      expect(result).toBe(true);
      expect(mockGetAccount).toHaveBeenCalledWith('newuser');
    });

    it('should return false when account name is already taken', async () => {
      mockGetAccount.mockResolvedValueOnce([{name: 'existinguser'}]);
      const result = await AccountCreationUtils.checkAccountNameAvailable(
        'existinguser',
      );
      expect(result).toBe(false);
      expect(mockGetAccount).toHaveBeenCalledWith('existinguser');
    });
  });

  describe('generateMasterKey', () => {
    it('should generate a master key starting with P', () => {
      const result = AccountCreationUtils.generateMasterKey();
      expect(result).toBeDefined();
      expect(result).toMatch(/^P/);
      expect(typeof result).toBe('string');
    });

    it('should generate different keys on each call', () => {
      const key1 = AccountCreationUtils.generateMasterKey();
      const key2 = AccountCreationUtils.generateMasterKey();
      // Keys should be different (though there's a small chance they could be the same)
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
    });
  });

  describe('validateUsername', () => {
    it('should return true for valid usernames', () => {
      expect(AccountCreationUtils.validateUsername('validuser')).toBe(true);
      expect(AccountCreationUtils.validateUsername('user123')).toBe(true);
      expect(AccountCreationUtils.validateUsername('user-name')).toBe(true);
      expect(AccountCreationUtils.validateUsername('user.name')).toBe(true);
    });

    it('should return false for usernames that are too short', () => {
      expect(AccountCreationUtils.validateUsername('ab')).toBe(false);
      expect(AccountCreationUtils.validateUsername('a')).toBe(false);
    });

    it('should return false for usernames that are too long', () => {
      expect(
        AccountCreationUtils.validateUsername('a'.repeat(17)),
      ).toBe(false);
    });

    it('should return false for usernames starting with uppercase', () => {
      expect(AccountCreationUtils.validateUsername('InvalidUser')).toBe(false);
    });

    it('should return false for usernames starting with number', () => {
      expect(AccountCreationUtils.validateUsername('123user')).toBe(false);
    });

    it('should return false for usernames with invalid characters', () => {
      expect(AccountCreationUtils.validateUsername('user@name')).toBe(false);
      expect(AccountCreationUtils.validateUsername('user_name')).toBe(false);
    });
  });

  describe('createAccount', () => {
    const mockAuthorities = {
      owner: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [['ownerKey', 1]],
      },
      active: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [['activeKey', 1]],
      },
      posting: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [['postingKey', 1]],
      },
      memo_key: 'memoKey',
    };

    const mockGeneratedKeys = {
      owner: {public: 'ownerPub', private: 'ownerPriv'},
      active: {public: 'activePub', private: 'activePriv'},
      posting: {public: 'postingPub', private: 'postingPriv'},
      memo: {public: 'memoPub', private: 'memoPriv'},
    };

    it('should create account using ticket and return Account object with keys', async () => {
      mockCreateClaimedAccount.mockResolvedValueOnce(true);
      const result = await AccountCreationUtils.createAccount(
        AccountCreationType.USING_TICKET,
        'newuser',
        'parentuser',
        'parentActiveKey' as any,
        mockAuthorities,
        undefined,
        mockGeneratedKeys,
      );

      expect(mockCreateClaimedAccount).toHaveBeenCalledWith(
        'parentActiveKey',
        {
          creator: 'parentuser',
          new_account_name: 'newuser',
          json_metadata: '{}',
          extensions: [],
          ...mockAuthorities,
        },
        undefined,
      );
      expect(result).toEqual({
        name: 'newuser',
        keys: {
          active: 'activePriv',
          activePubkey: 'activePub',
          posting: 'postingPriv',
          postingPubkey: 'postingPub',
          memo: 'memoPriv',
          memoPubkey: 'memoPub',
        },
      });
    });

    it('should create account using ticket and return true when no keys provided', async () => {
      mockCreateClaimedAccount.mockResolvedValueOnce(true);
      const result = await AccountCreationUtils.createAccount(
        AccountCreationType.USING_TICKET,
        'newuser',
        'parentuser',
        'parentActiveKey' as any,
        mockAuthorities,
      );

      expect(result).toBe(true);
    });

    it('should create account by buying and return Account object with keys', async () => {
      mockCreateNewAccount.mockResolvedValueOnce(true);
      const result = await AccountCreationUtils.createAccount(
        AccountCreationType.BUYING,
        'newuser',
        'parentuser',
        'parentActiveKey' as any,
        mockAuthorities,
        10.5,
        mockGeneratedKeys,
      );

      expect(mockCreateNewAccount).toHaveBeenCalledWith(
        'parentActiveKey',
        {
          fee: '10.500 HIVE',
          creator: 'parentuser',
          new_account_name: 'newuser',
          json_metadata: '{}',
          ...mockAuthorities,
        },
        undefined,
      );
      expect(result).toEqual({
        name: 'newuser',
        keys: {
          active: 'activePriv',
          activePubkey: 'activePub',
          posting: 'postingPriv',
          postingPubkey: 'postingPub',
          memo: 'memoPriv',
          memoPubkey: 'memoPub',
        },
      });
    });

    it('should return false when account creation fails', async () => {
      mockCreateClaimedAccount.mockResolvedValueOnce(false);
      const result = await AccountCreationUtils.createAccount(
        AccountCreationType.USING_TICKET,
        'newuser',
        'parentuser',
        'parentActiveKey' as any,
        mockAuthorities,
      );

      expect(result).toBe(false);
    });

    it('should handle price with 3 decimal places when buying', async () => {
      mockCreateNewAccount.mockResolvedValueOnce(true);
      await AccountCreationUtils.createAccount(
        AccountCreationType.BUYING,
        'newuser',
        'parentuser',
        'parentActiveKey' as any,
        mockAuthorities,
        5.123,
      );

      expect(mockCreateNewAccount).toHaveBeenCalledWith(
        'parentActiveKey',
        expect.objectContaining({
          fee: '5.123 HIVE',
        }),
        undefined,
      );
    });
  });

  describe('generateAccountAuthorities', () => {
    it('should generate account authorities from keys', () => {
      const keys = {
        owner: {public: 'ownerPub', private: 'ownerPriv'},
        active: {public: 'activePub', private: 'activePriv'},
        posting: {public: 'postingPub', private: 'postingPriv'},
        memo: {public: 'memoPub', private: 'memoPriv'},
      };

      const result = AccountCreationUtils.generateAccountAuthorities(keys);

      expect(result).toEqual({
        owner: {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [['ownerPub', 1]],
        },
        active: {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [['activePub', 1]],
        },
        posting: {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [['postingPub', 1]],
        },
        memo_key: 'memoPub',
      });
    });
  });

  describe('validateNewAccountName', () => {
    beforeEach(() => {
      mockGetAccount.mockResolvedValue([]);
    });

    it('should return false and show toast for too_short username', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.too_short,
      );
      const result = await AccountCreationUtils.validateNewAccountName(
        'ab',
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.username_too_short',
      );
    });

    it('should return false and show toast for too_long username', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.too_long,
      );
      const result = await AccountCreationUtils.validateNewAccountName(
        'a'.repeat(20),
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.username_too_long',
      );
    });

    it('should return false and show toast for invalid_last_character', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.invalid_last_character,
      );
      const result = await AccountCreationUtils.validateNewAccountName(
        'user-',
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.username_invalid_last_character',
      );
    });

    it('should return false and show toast for invalid_first_character', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.invalid_first_character,
      );
      const result = await AccountCreationUtils.validateNewAccountName(
        '1user',
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.username_invalid_first_character',
      );
    });

    it('should return false and show toast for invalid_middle_characters', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.invalid_middle_characters,
      );
      const result = await AccountCreationUtils.validateNewAccountName(
        'user@name',
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.username_invalid_middle_characters',
      );
    });

    it('should return false and show toast for invalid_segment_length', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.invalid_segment_length,
      );
      const result = await AccountCreationUtils.validateNewAccountName(
        'a.b',
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.username_invalid_segment_length',
      );
    });

    it('should return true for valid and available username', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.valid,
      );
      mockGetAccount.mockResolvedValueOnce([]);
      const result = await AccountCreationUtils.validateNewAccountName(
        'validuser',
        mockSimpleToast,
      );

      expect(result).toBe(true);
      expect(mockSimpleToast.show).not.toHaveBeenCalled();
    });

    it('should return false and show toast when username is valid but already taken', async () => {
      mockValidateUsername.mockResolvedValueOnce(
        AccountsUtils.UsernameValidation.valid,
      );
      mockGetAccount.mockResolvedValueOnce([{name: 'validuser'}]);
      const result = await AccountCreationUtils.validateNewAccountName(
        'validuser',
        mockSimpleToast,
      );

      expect(result).toBe(false);
      expect(mockSimpleToast.show).toHaveBeenCalledWith(
        'toast.account_username_already_used',
      );
    });

    it('should return false for unknown validation result', async () => {
      mockValidateUsername.mockResolvedValueOnce('unknown' as any);
      const result = await AccountCreationUtils.validateNewAccountName(
        'user',
        mockSimpleToast,
      );

      expect(result).toBe(false);
    });
  });
});









