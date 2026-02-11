import SecureStoreUtils from '../secureStore.utils';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('SecureStoreUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveOnSecureStore', () => {
    it('should save data to secure store', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
      await SecureStoreUtils.saveOnSecureStore('test', 'data', 'title');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'test',
        'data',
        expect.objectContaining({
          requireAuthentication: true,
        }),
      );
    });
  });

  describe('getFromSecureStore', () => {
    it('should retrieve data from secure store', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('data');
      const result = await SecureStoreUtils.getFromSecureStore('test');
      expect(result).toBe('data');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({
          requireAuthentication: true,
        }),
      );
    });
  });

  describe('deleteFromSecureStore', () => {
    it('should delete item from secure store', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
      await SecureStoreUtils.deleteFromSecureStore('test');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe('clearSecureStore', () => {
    it('should clear known keys', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(true);
      await SecureStoreUtils.clearSecureStore();

      // Should delete all known keys
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(5);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        expect.stringMatching(/SECURE_MK|MASTER_KEY|PIN_SALT|PIN_HASH|LOCKOUT_DATA/),
        expect.objectContaining({
          keychainService: expect.any(String),
        }),
      );
    });
  });
});
