import {EncryptedStorageUtils} from '../encryptedStorage.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {encryptJson, decryptToJson} from '../../encrypt.utils';

jest.mock('../../encrypt.utils');

describe('EncryptedStorageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFromEncryptedStorage', () => {
    it('should decrypt and return value', async () => {
      const mockDecrypted = {list: [1, 2, 3]};
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('encryptedData');
      (decryptToJson as jest.Mock).mockReturnValueOnce(mockDecrypted);
      const result = await EncryptedStorageUtils.getFromEncryptedStorage(
        KeychainStorageKeyEnum.ACCOUNTS,
        'password',
      );
      expect(result).toEqual(mockDecrypted);
      expect(decryptToJson).toHaveBeenCalledWith('encryptedData', 'password');
    });

    it('should return null if no value stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await EncryptedStorageUtils.getFromEncryptedStorage(
        KeychainStorageKeyEnum.ACCOUNTS,
        'password',
      );
      expect(result).toBeNull();
    });
  });

  describe('saveOnEncryptedStorage', () => {
    it('should encrypt and save value', async () => {
      const mockEncrypted = 'encryptedData';
      (encryptJson as jest.Mock).mockReturnValueOnce(mockEncrypted);
      await EncryptedStorageUtils.saveOnEncryptedStorage(
        KeychainStorageKeyEnum.ACCOUNTS,
        {list: [1, 2, 3]},
        'password',
      );
      expect(encryptJson).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.ACCOUNTS,
        mockEncrypted,
      );
    });
  });

  describe('removeFromEncryptedStorage', () => {
    it('should remove item from storage', async () => {
      await EncryptedStorageUtils.removeFromEncryptedStorage(
        KeychainStorageKeyEnum.ACCOUNTS,
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.ACCOUNTS,
      );
    });
  });

  describe('clearEncryptedStorage', () => {
    it('should clear all storage', async () => {
      await EncryptedStorageUtils.clearEncryptedStorage();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
});
