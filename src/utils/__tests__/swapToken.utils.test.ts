import {SwapTokenUtils} from '../swapToken.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainSwapApi} from 'api/keychainSwap.api';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {getUserBalance, getTokenInfo} from '../tokens.utils';

jest.mock('api/keychainSwap.api');
jest.mock('../tokens.utils');

describe('SwapTokenUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEstimate', () => {
    it('should fetch swap estimate', async () => {
      const mockEstimate = {amount: 100, steps: []};
      (KeychainSwapApi.get as jest.Mock).mockResolvedValueOnce({
        error: null,
        result: mockEstimate,
      });
      const result = await SwapTokenUtils.getEstimate(
        'HIVE',
        'HBD',
        '100',
        jest.fn(),
      );
      expect(result).toEqual(mockEstimate);
      expect(KeychainSwapApi.get).toHaveBeenCalledWith(
        'token-swap/estimate/HIVE/HBD/100',
      );
    });

    it('should handle errors', async () => {
      const handleErrors = jest.fn();
      (KeychainSwapApi.get as jest.Mock).mockResolvedValueOnce({
        error: 'Invalid tokens',
        result: null,
      });
      await expect(
        SwapTokenUtils.getEstimate('HIVE', 'HBD', '100', handleErrors),
      ).rejects.toBe('Invalid tokens');
      expect(handleErrors).toHaveBeenCalled();
    });
  });

  describe('saveLastUsed', () => {
    it('should save last used tokens', async () => {
      await SwapTokenUtils.saveLastUsed('HIVE', 'HBD');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.SWAP_LAST_USED_TOKENS,
        JSON.stringify({from: 'HIVE', to: 'HBD'}),
      );
    });
  });

  describe('getLastUsed', () => {
    it('should return last used tokens', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({from: 'HIVE', to: 'HBD'}),
      );
      const result = await SwapTokenUtils.getLastUsed();
      expect(result).toEqual({from: 'HIVE', to: 'HBD'});
    });

    it('should return null values if no last used', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await SwapTokenUtils.getLastUsed();
      expect(result).toEqual({from: null, to: null});
    });
  });

  describe('getServerStatus', () => {
    it('should fetch server status', async () => {
      const mockStatus = {status: 'online'};
      (KeychainSwapApi.get as jest.Mock).mockResolvedValueOnce({
        result: mockStatus,
      });
      const result = await SwapTokenUtils.getServerStatus();
      expect(result).toEqual(mockStatus);
    });
  });

  describe('getConfig', () => {
    it('should fetch swap config', async () => {
      const mockConfig = {enabled: true};
      (KeychainSwapApi.get as jest.Mock).mockResolvedValueOnce({
        result: mockConfig,
      });
      const result = await SwapTokenUtils.getConfig();
      expect(result).toEqual(mockConfig);
    });
  });

  describe('cancelSwap', () => {
    it('should cancel swap', async () => {
      (KeychainSwapApi.post as jest.Mock).mockResolvedValueOnce({});
      await SwapTokenUtils.cancelSwap('swap123');
      expect(KeychainSwapApi.post).toHaveBeenCalledWith(
        'token-swap/swap123/cancel',
        {},
      );
    });
  });
});
