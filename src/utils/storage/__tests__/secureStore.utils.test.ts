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
    it('should clear known keys and chunked entries', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('2');
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(true);
      await SecureStoreUtils.clearSecureStore('test');

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('test_length', {
        keychainService: 'test',
      });

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('test_0', {
        keychainService: 'test_0',
      });
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('test_1', {
        keychainService: 'test_1',
      });
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('test_length', {
        keychainService: 'test_length',
      });
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('test', {
        keychainService: 'test',
      });
      // Also clears known app keys (e.g., master key, pin hash)
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        expect.stringMatching(/SECURE_MK|MASTER_KEY|PIN_SALT|PIN_HASH|LOCKOUT_DATA/),
        expect.any(Object),
      );
    });
  });
});
