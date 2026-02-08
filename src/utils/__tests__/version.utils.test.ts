import Constants from 'expo-constants';
import {VersionLogUtils} from '../version.utils';
import api from 'api/keychain.api';

jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '2.10.1',
  },
}));
jest.mock('api/keychain.api', () => ({
  get: jest.fn(),
}));
jest.mock('package.json', () => ({
  name: 'mobile-keychain',
}));

describe('VersionLogUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset expoConfig to default
    (Constants.expoConfig as any) = {version: '2.10.1'};
  });

  describe('getCurrentMobileAppVersion', () => {
    it('should return current app version', () => {
      const result = VersionLogUtils.getCurrentMobileAppVersion();

      expect(result).toEqual({
        name: 'mobile-keychain',
        version: '2.10.1',
      });
    });

    it('should handle version with suffix', () => {
      (Constants.expoConfig as any).version = '2.10.1-beta';
      const result = VersionLogUtils.getCurrentMobileAppVersion();

      expect(result.version).toBe('2.10.1');
    });
    it('should handle undefined expoConfig', () => {
      (Constants.expoConfig as any) = undefined;
      const result = VersionLogUtils.getCurrentMobileAppVersion();
      expect(result.name).toBe('mobile-keychain');
      expect(result.version).toBeUndefined();
    });

    it('should handle version without suffix', () => {
      (Constants.expoConfig as any).version = '2.10.1';
      const result = VersionLogUtils.getCurrentMobileAppVersion();
      expect(result.version).toBe('2.10.1');
    });

    it('should handle version with multiple dashes', () => {
      (Constants.expoConfig as any).version = '2.10.1-beta-1';
      const result = VersionLogUtils.getCurrentMobileAppVersion();
      expect(result.version).toBe('2.10.1');
    });
  });

  describe('getLastVersion', () => {
    it('should get last version from API', async () => {
      const mockResponse = {version: '2.10.0'};
      (api.get as jest.Mock).mockResolvedValue({data: mockResponse});

      const result = await VersionLogUtils.getLastVersion();

      expect(result).toEqual(mockResponse);
      expect(api.get).toHaveBeenCalledWith('/last-version-mobile');
    });

    it('should handle API errors', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      await expect(VersionLogUtils.getLastVersion()).rejects.toThrow('API Error');
    });

    it('should handle empty response', async () => {
      (api.get as jest.Mock).mockResolvedValue({data: {}});
      const result = await VersionLogUtils.getLastVersion();
      expect(result).toEqual({});
    });

    it('should handle response with additional fields', async () => {
      const mockResponse = {
        version: '2.10.0',
        build: '123',
        releaseDate: '2024-01-01',
      };
      (api.get as jest.Mock).mockResolvedValue({data: mockResponse});
      const result = await VersionLogUtils.getLastVersion();
      expect(result).toEqual(mockResponse);
    });
  });
});
