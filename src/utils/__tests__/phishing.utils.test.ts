import PhishingUtils from '../phishing.utils';
import KeychainApi from 'api/keychain.api';

jest.mock('api/keychain.api');

describe('PhishingUtils', () => {
  describe('getPhishingAccounts', () => {
    it('should fetch phishing accounts from API', async () => {
      const mockAccounts = ['phishing1', 'phishing2'];
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: mockAccounts,
      });

      const result = await PhishingUtils.getPhishingAccounts();
      expect(result).toEqual(mockAccounts);
      expect(KeychainApi.get).toHaveBeenCalledWith('hive/phishingAccounts');
    });
  });

  describe('getPhishingAccounts', () => {
    it('should handle empty array response', async () => {
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: [],
      });

      const result = await PhishingUtils.getPhishingAccounts();
      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      (KeychainApi.get as jest.Mock).mockRejectedValueOnce(
        new Error('API Error'),
      );

      await expect(PhishingUtils.getPhishingAccounts()).rejects.toThrow(
        'API Error',
      );
    });

    it('should handle large list of accounts', async () => {
      const mockAccounts = Array.from({length: 100}, (_, i) => `phishing${i}`);
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: mockAccounts,
      });

      const result = await PhishingUtils.getPhishingAccounts();
      expect(result).toHaveLength(100);
      expect(result[0]).toBe('phishing0');
    });
  });

  describe('getBlacklistedDomains', () => {
    it('should fetch blacklisted domains from API', async () => {
      const mockDomains = ['evil.com', 'phishing.net'];
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: mockDomains,
      });

      const result = await PhishingUtils.getBlacklistedDomains();
      expect(result).toEqual(mockDomains);
      expect(KeychainApi.get).toHaveBeenCalledWith('hive/blacklistedDomains');
    });

    it('should handle empty array response', async () => {
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: [],
      });

      const result = await PhishingUtils.getBlacklistedDomains();
      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      (KeychainApi.get as jest.Mock).mockRejectedValueOnce(
        new Error('Network Error'),
      );

      await expect(PhishingUtils.getBlacklistedDomains()).rejects.toThrow(
        'Network Error',
      );
    });

    it('should handle domains with subdomains', async () => {
      const mockDomains = [
        'evil.com',
        'subdomain.evil.com',
        'www.phishing.net',
      ];
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: mockDomains,
      });

      const result = await PhishingUtils.getBlacklistedDomains();
      expect(result).toEqual(mockDomains);
      expect(result).toContain('subdomain.evil.com');
    });
  });
});







