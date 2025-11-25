jest.mock('utils/localize', () => ({
  translate: jest.fn((key, params) => {
    if (params) {
      return `${key} ${JSON.stringify(params)}`;
    }
    return key;
  }),
}));

const mockGetAccounts = jest.fn();
const mockClient = {
  database: {
    getAccounts: mockGetAccounts,
  },
};

const mockPrivateKey = {
  toString: jest.fn(() => '5KQwr...'),
  createPublic: jest.fn(() => ({
    toString: jest.fn(() => 'STMpublickey'),
  })),
};

const mockPostingKey = {
  toString: jest.fn(() => '5KQwrPosting...'),
  createPublic: jest.fn(() => ({
    toString: jest.fn(() => 'STMpostingkey'),
  })),
};

const mockActiveKey = {
  toString: jest.fn(() => '5KQwrActive...'),
  createPublic: jest.fn(() => ({
    toString: jest.fn(() => 'STMactivekey'),
  })),
};

const mockMemoKey = {
  toString: jest.fn(() => '5KQwrMemo...'),
  createPublic: jest.fn(() => ({
    toString: jest.fn(() => 'STMmemokey'),
  })),
};

const mockHive = {
  PrivateKey: {
    fromString: jest.fn(),
    fromLogin: jest.fn(),
  },
};

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(() => mockClient),
  default: mockHive,
}));

import validateKeys, {
  getPublicKeyFromPrivateKeyString,
  validateFromObject,
} from '../keyValidation.utils';
import {ExtendedAccount} from '@hiveio/dhive';
import hive from 'utils/hiveLibs.utils';

// Update the mock reference
(hive as any).PrivateKey = mockHive.PrivateKey;

describe('keyValidation.utils', () => {
  const mockAccount: ExtendedAccount = {
    name: 'user1',
    memo_key: 'STMmemokey',
    posting: {
      key_auths: [['STMpostingkey', 1]],
      account_auths: [],
      weight_threshold: 1,
    },
    active: {
      key_auths: [['STMactivekey', 1]],
      account_auths: [],
      weight_threshold: 1,
    },
  } as ExtendedAccount;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccounts.mockResolvedValue([mockAccount]);
  });

  describe('getPublicKeyFromPrivateKeyString', () => {
    it('should get public key from private key string', () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockPrivateKey);
      const result = getPublicKeyFromPrivateKeyString('5KQwr...');
      expect(result).toBe('STMpublickey');
      expect(hive.PrivateKey.fromString).toHaveBeenCalledWith('5KQwr...');
    });

    it('should return null on error', () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid key');
      });
      const result = getPublicKeyFromPrivateKeyString('invalid');
      expect(result).toBeNull();
    });
  });

  describe('validateFromObject', () => {
    it('should validate memo key', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockMemoKey);
      const result = await validateFromObject({
        name: 'user1',
        keys: {
          memo: '5KQwrMemo...',
        },
      });
      expect(result).toBeDefined();
      expect(result?.memo).toBe('5KQwrMemo...');
      expect(result?.memoPubkey).toBe('STMmemokey');
    });

    it('should validate posting key', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockPostingKey);
      const result = await validateFromObject({
        name: 'user1',
        keys: {
          posting: '5KQwrPosting...',
        },
      });
      expect(result).toBeDefined();
      expect(result?.posting).toBe('5KQwrPosting...');
      expect(result?.postingPubkey).toBe('STMpostingkey');
    });

    it('should validate active key', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockActiveKey);
      const result = await validateFromObject({
        name: 'user1',
        keys: {
          active: '5KQwrActive...',
        },
      });
      expect(result).toBeDefined();
      expect(result?.active).toBe('5KQwrActive...');
      expect(result?.activePubkey).toBe('STMactivekey');
    });

    it('should validate multiple keys', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation((key) => {
        if (key === '5KQwrMemo...') return mockMemoKey;
        if (key === '5KQwrPosting...') return mockPostingKey;
        if (key === '5KQwrActive...') return mockActiveKey;
        return mockPrivateKey;
      });
      const result = await validateFromObject({
        name: 'user1',
        keys: {
          memo: '5KQwrMemo...',
          posting: '5KQwrPosting...',
          active: '5KQwrActive...',
        },
      });
      expect(result).toBeDefined();
      expect(result?.memo).toBeDefined();
      expect(result?.posting).toBeDefined();
      expect(result?.active).toBeDefined();
    });

    it('should return null when no keys match', async () => {
      const wrongKey = {
        toString: jest.fn(() => '5KQwrWrong...'),
        createPublic: jest.fn(() => ({
          toString: jest.fn(() => 'STMwrongkey'),
        })),
      };
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(wrongKey);
      const result = await validateFromObject({
        name: 'user1',
        keys: {
          memo: '5KQwrWrong...',
        },
      });
      expect(result).toBeNull();
    });

    it('should return null when getPublicKeyFromPrivateKeyString returns null', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid key');
      });
      const result = await validateFromObject({
        name: 'user1',
        keys: {
          memo: 'invalid',
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('validateKeys (default export)', () => {
    it('should validate private key', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockPostingKey);
      const result = await validateKeys('user1', '5KQwrPosting...');
      expect(result).toBeDefined();
      expect(result?.posting).toBe('5KQwrPosting...');
    });

    it('should validate memo key from private key', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockMemoKey);
      const result = await validateKeys('user1', '5KQwrMemo...');
      expect(result).toBeDefined();
      expect(result?.memo).toBe('5KQwrMemo...');
    });

    it('should validate active key from private key', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockActiveKey);
      const result = await validateKeys('user1', '5KQwrActive...');
      expect(result).toBeDefined();
      expect(result?.active).toBe('5KQwrActive...');
    });

    it('should validate master password', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Not a private key');
      });
      (hive.PrivateKey.fromLogin as jest.Mock)
        .mockReturnValueOnce(mockPostingKey)
        .mockReturnValueOnce(mockActiveKey)
        .mockReturnValueOnce(mockMemoKey);
      const result = await validateKeys('user1', 'masterpassword');
      expect(result).toBeDefined();
      expect(hive.PrivateKey.fromLogin).toHaveBeenCalledTimes(3);
    });

    it('should return null when master password does not match', async () => {
      const wrongPostingKey = {
        toString: jest.fn(() => '5KQwrWrongPosting...'),
        createPublic: jest.fn(() => ({
          toString: jest.fn(() => 'STMwrongpostingkey'),
        })),
      };
      const wrongActiveKey = {
        toString: jest.fn(() => '5KQwrWrongActive...'),
        createPublic: jest.fn(() => ({
          toString: jest.fn(() => 'STMwrongactivekey'),
        })),
      };
      const wrongMemoKey = {
        toString: jest.fn(() => '5KQwrWrongMemo...'),
        createPublic: jest.fn(() => ({
          toString: jest.fn(() => 'STMwrongmemokey'),
        })),
      };
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Not a private key');
      });
      (hive.PrivateKey.fromLogin as jest.Mock)
        .mockReturnValueOnce(wrongPostingKey)
        .mockReturnValueOnce(wrongActiveKey)
        .mockReturnValueOnce(wrongMemoKey);
      const result = await validateKeys('user1', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should throw error when account not found', async () => {
      mockGetAccounts.mockResolvedValueOnce([]);
      await expect(validateKeys('nonexistent', '5KQwr...')).rejects.toThrow();
    });

    it('should throw error when public key is provided', async () => {
      await expect(validateKeys('user1', 'STMpublickey')).rejects.toThrow(
        'This is a public key!',
      );
    });

    it('should trim username', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockReturnValue(mockPostingKey);
      await validateKeys('  user1  ', '5KQwrPosting...');
      expect(mockGetAccounts).toHaveBeenCalledWith(['user1']);
    });

    it('should handle master password with only posting key match', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Not a private key');
      });
      (hive.PrivateKey.fromLogin as jest.Mock)
        .mockReturnValueOnce(mockPostingKey)
        .mockReturnValueOnce({
          toString: jest.fn(() => '5KQwrWrongActive...'),
          createPublic: jest.fn(() => ({
            toString: jest.fn(() => 'STMwrongactivekey'),
          })),
        })
        .mockReturnValueOnce({
          toString: jest.fn(() => '5KQwrWrongMemo...'),
          createPublic: jest.fn(() => ({
            toString: jest.fn(() => 'STMwrongmemokey'),
          })),
        });
      const result = await validateKeys('user1', 'masterpassword');
      expect(result).toBeDefined();
      expect(result?.posting).toBeDefined();
    });

    it('should handle master password with only active key match', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Not a private key');
      });
      (hive.PrivateKey.fromLogin as jest.Mock)
        .mockReturnValueOnce({
          toString: jest.fn(() => '5KQwrWrongPosting...'),
          createPublic: jest.fn(() => ({
            toString: jest.fn(() => 'STMwrongpostingkey'),
          })),
        })
        .mockReturnValueOnce(mockActiveKey)
        .mockReturnValueOnce({
          toString: jest.fn(() => '5KQwrWrongMemo...'),
          createPublic: jest.fn(() => ({
            toString: jest.fn(() => 'STMwrongmemokey'),
          })),
        });
      const result = await validateKeys('user1', 'masterpassword');
      expect(result).toBeDefined();
      expect(result?.active).toBeDefined();
    });

    it('should handle master password with only memo key match', async () => {
      (hive.PrivateKey.fromString as jest.Mock).mockImplementation(() => {
        throw new Error('Not a private key');
      });
      (hive.PrivateKey.fromLogin as jest.Mock)
        .mockReturnValueOnce({
          toString: jest.fn(() => '5KQwrWrongPosting...'),
          createPublic: jest.fn(() => ({
            toString: jest.fn(() => 'STMwrongpostingkey'),
          })),
        })
        .mockReturnValueOnce({
          toString: jest.fn(() => '5KQwrWrongActive...'),
          createPublic: jest.fn(() => ({
            toString: jest.fn(() => 'STMwrongactivekey'),
          })),
        })
        .mockReturnValueOnce(mockMemoKey);
      const result = await validateKeys('user1', 'masterpassword');
      expect(result).toBeDefined();
      expect(result?.memo).toBeDefined();
    });

    it('should handle errors and rethrow as Error', async () => {
      mockGetAccounts.mockRejectedValueOnce(new Error('Network error'));
      await expect(validateKeys('user1', '5KQwr...')).rejects.toThrow('Network error');
    });
  });
});
