jest.mock('expo-device', () => ({
  __esModule: true,
  default: {
    modelName: 'iPhone',
    isDevice: false,
  },
}));

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1, 2])),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('utils/navigation.utils', () => ({
  navigate: jest.fn(),
}));

jest.mock('../encryptedStorage.utils', () => ({
  EncryptedStorageUtils: {
    getFromEncryptedStorage: jest.fn(),
    saveOnEncryptedStorage: jest.fn(),
  },
}));

jest.mock('../secureStore.utils', () => ({
  __esModule: true,
  default: {
    saveOnSecureStore: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import StorageUtils from '../storage.utils';
import {EncryptedStorageUtils} from '../encryptedStorage.utils';
import SecureStoreUtils from '../secureStore.utils';

describe('StorageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requireBiometricsLogin', () => {
    it('should require biometrics login on Android', async () => {
      const Platform = require('react-native').Platform;
      const originalOS = Platform.OS;
      Platform.OS = 'android';
      await StorageUtils.requireBiometricsLogin('masterkey', 'reason');
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalled();
      Platform.OS = originalOS;
    });
  });

  describe('getAccounts', () => {
    it('reads version 2 accounts from encrypted AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('2');
      (
        EncryptedStorageUtils.getFromEncryptedStorage as jest.Mock
      ).mockResolvedValueOnce({list: [{name: 'alice'}]});

      const result = await StorageUtils.getAccounts('pin');

      expect(result).toEqual({list: [{name: 'alice'}]});
      expect(EncryptedStorageUtils.getFromEncryptedStorage).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.ACCOUNTS,
        'pin',
      );
    });

    it('fails closed for pre-v2 accounts without native Keychain migration', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await StorageUtils.getAccounts('pin');

      expect(result).toBeNull();
      expect(
        EncryptedStorageUtils.getFromEncryptedStorage,
      ).not.toHaveBeenCalled();
    });
  });
});
