import {HiveEngineConfigUtils} from '../hiveEngineConfig.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {
  DEFAULT_HIVE_ENGINE_RPCS,
  DEFAULT_ACCOUNT_HISTORY_RPCS,
} from 'src/interfaces/hiveEngineRpc.interface';

describe('HiveEngineConfigUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getApi', () => {
    it('should return default API', () => {
      const result = HiveEngineConfigUtils.getApi();
      expect(result).toBeDefined();
    });
  });

  describe('setActiveApi', () => {
    it('should set active API', () => {
      HiveEngineConfigUtils.setActiveApi('https://new-api.com');
      const result = HiveEngineConfigUtils.getApi();
      expect(result).toBe('https://new-api.com');
    });
  });

  describe('getAccountHistoryApi', () => {
    it('should return default account history API', () => {
      const result = HiveEngineConfigUtils.getAccountHistoryApi();
      expect(result).toBeDefined();
    });
  });

  describe('setActiveAccountHistoryApi', () => {
    it('should set active account history API', () => {
      HiveEngineConfigUtils.setActiveAccountHistoryApi('https://new-history-api.com');
      const result = HiveEngineConfigUtils.getAccountHistoryApi();
      expect(result).toBe('https://new-history-api.com');
    });
  });

  describe('getCustomRpcs', () => {
    it('should return custom RPCs', async () => {
      const customRpcs = ['https://custom1.com', 'https://custom2.com'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(customRpcs),
      );
      const result = await HiveEngineConfigUtils.getCustomRpcs();
      expect(result).toEqual(customRpcs);
    });

    it('should return empty array if no custom RPCs', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await HiveEngineConfigUtils.getCustomRpcs();
      expect(result).toEqual([]);
    });
  });

  describe('addCustomRpc', () => {
    it('should add custom RPC', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([]),
      );
      await HiveEngineConfigUtils.addCustomRpc('https://new-rpc.com');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('deleteCustomRpc', () => {
    it('should delete custom RPC', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(['https://rpc1.com', 'https://rpc2.com']),
      );
      await HiveEngineConfigUtils.deleteCustomRpc('https://rpc1.com');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('isRpcDefault', () => {
    it('should return true for default RPC', () => {
      const result = HiveEngineConfigUtils.isRpcDefault(DEFAULT_HIVE_ENGINE_RPCS[0]);
      expect(result).toBe(true);
    });

    it('should return false for custom RPC', () => {
      const result = HiveEngineConfigUtils.isRpcDefault('https://custom.com');
      expect(result).toBe(false);
    });
  });

  describe('isAccountHistoryApiDefault', () => {
    it('should return true for default API', () => {
      const result = HiveEngineConfigUtils.isAccountHistoryApiDefault(
        DEFAULT_ACCOUNT_HISTORY_RPCS[0],
      );
      expect(result).toBe(true);
    });

    it('should return false for custom API', () => {
      const result = HiveEngineConfigUtils.isAccountHistoryApiDefault(
        'https://custom.com',
      );
      expect(result).toBe(false);
    });
  });

  describe('switchToNextRpc', () => {
    it('should switch to next RPC in list', async () => {
      const currentApi = HiveEngineConfigUtils.getApi();
      const result = await HiveEngineConfigUtils.switchToNextRpc();
      expect(result).toBeDefined();
      expect(result).not.toBe(currentApi);
    });
  });
});
