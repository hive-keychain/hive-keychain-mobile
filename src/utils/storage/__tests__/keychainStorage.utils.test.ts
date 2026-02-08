jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: jest.fn(),
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  STORAGE_TYPE: {
    FB: 'FB',
    RSA: 'RSA',
  },
  ACCESS_CONTROL: {
    BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BIOMETRY_ANY_OR_DEVICE_PASSCODE',
  },
  AUTHENTICATION_TYPE: {
    DEVICE_PASSCODE_OR_BIOMETRICS: 'DEVICE_PASSCODE_OR_BIOMETRICS',
  },
  ACCESSIBLE: {
    WHEN_UNLOCKED: 'WHEN_UNLOCKED',
  },
}));

jest.mock('../../format.utils', () => ({
  chunkArray: jest.fn((arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }),
}));

import {
  saveOnKeychain,
  getFromKeychain,
  clearKeychain,
} from '../keychainStorage.utils';
import * as Keychain from 'react-native-keychain';

describe('keychainStorage.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveOnKeychain', () => {
    it('should save data in chunks', async () => {
      (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValueOnce(
        null,
      );
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);
      await saveOnKeychain('test', 'a'.repeat(300)); // Will create 2 chunks
      expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(3); // 2 chunks + length
    });
  });

  describe('getFromKeychain', () => {
    it('should retrieve data from keychain', async () => {
      (Keychain.getGenericPassword as jest.Mock)
        .mockResolvedValueOnce({password: '2'})
        .mockResolvedValueOnce({password: 'chunk1'})
        .mockResolvedValueOnce({password: 'chunk2'});
      const result = await getFromKeychain('test');
      expect(result).toBe('chunk1chunk2');
    });

    it('should return undefined if no password found', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce(false);
      const result = await getFromKeychain('test');
      expect(result).toBeUndefined();
    });
  });

  describe('clearKeychain', () => {
    it('should clear all chunks', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce({
        password: '2',
      });
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(true);
      await clearKeychain('test');
      expect(Keychain.resetGenericPassword).toHaveBeenCalledTimes(3); // 2 chunks + main
    });
  });
});
