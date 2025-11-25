import {EcosystemUtils} from '../ecosystem.utils';
import keychain from 'api/keychain.api';

jest.mock('api/keychain.api');

describe('EcosystemUtils', () => {
  describe('getDappList', () => {
    it('should fetch dapp list for hive chain', async () => {
      const mockDapps = [
        {name: 'Dapp1', category: 'DeFi'},
        {name: 'Dapp2', category: 'Social'},
      ];
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockDapps,
      });

      const result = await EcosystemUtils.getDappList('hive');
      expect(result).toEqual(mockDapps);
      expect(keychain.get).toHaveBeenCalledWith('hive/ecosystem/dapps');
    });

    it('should fetch dapp list for hive testnet', async () => {
      const mockDapps = [{name: 'TestDapp', category: 'Test'}];
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockDapps,
      });

      const result = await EcosystemUtils.getDappList('HIVE');
      expect(result).toEqual(mockDapps);
      expect(keychain.get).toHaveBeenCalledWith('hive/ecosystem/dapps');
    });

    it('should handle different chains', async () => {
      const mockDapps = [{name: 'EVM Dapp'}];
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockDapps,
      });

      const result = await EcosystemUtils.getDappList('EVM');
      expect(result).toEqual(mockDapps);
      expect(keychain.get).toHaveBeenCalledWith('evm/ecosystem/dapps');
    });

    it('should convert chain to lowercase', async () => {
      const mockDapps = [{name: 'Test Dapp'}];
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockDapps,
      });

      await EcosystemUtils.getDappList('TESTNET');
      expect(keychain.get).toHaveBeenCalledWith('testnet/ecosystem/dapps');
    });

    it('should handle empty dapp list', async () => {
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: [],
      });

      const result = await EcosystemUtils.getDappList('hive');
      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      (keychain.get as jest.Mock).mockRejectedValueOnce(
        new Error('API Error'),
      );

      await expect(EcosystemUtils.getDappList('hive')).rejects.toThrow(
        'API Error',
      );
    });

    it('should handle mixed case chain names', async () => {
      const mockDapps = [{name: 'Mixed Case'}];
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockDapps,
      });

      await EcosystemUtils.getDappList('HiVe');
      expect(keychain.get).toHaveBeenCalledWith('hive/ecosystem/dapps');
    });

    it('should handle chains with special characters', async () => {
      const mockDapps = [{name: 'Special Chain'}];
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockDapps,
      });

      await EcosystemUtils.getDappList('CHAIN-NAME');
      expect(keychain.get).toHaveBeenCalledWith('chain-name/ecosystem/dapps');
    });
  });
});







