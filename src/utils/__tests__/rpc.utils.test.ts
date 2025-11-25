import {
  getCustomRpcs,
  addCustomRpc,
  deleteCustomRpc,
  getRPCUri,
  checkRpcStatus,
} from '../rpc.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {Rpc} from 'actions/interfaces';
import axios from 'axios';

jest.mock('axios');

describe('rpc.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCustomRpcs', () => {
    it('should return empty array when no custom RPCs stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getCustomRpcs();
      expect(result).toEqual([]);
    });

    it('should return parsed custom RPCs', async () => {
      const customRpcs: Rpc[] = [
        {uri: 'https://rpc1.com', testnet: false} as Rpc,
        {uri: 'https://rpc2.com', testnet: false} as Rpc,
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(customRpcs),
      );
      const result = await getCustomRpcs();
      expect(result).toEqual(customRpcs);
    });

    it('should return empty array on parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');
      const result = await getCustomRpcs();
      expect(result).toEqual([]);
    });
  });

  describe('addCustomRpc', () => {
    it('should add new RPC to list', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const newRpc: Rpc = {uri: 'https://newrpc.com', testnet: false} as Rpc;
      await addCustomRpc(newRpc);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.CUSTOM_RPC_LIST,
        JSON.stringify([newRpc]),
      );
    });

    it('should not add duplicate RPC', async () => {
      const existingRpc: Rpc = {uri: 'https://existing.com'} as Rpc;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([existingRpc]),
      );
      await addCustomRpc(existingRpc);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('deleteCustomRpc', () => {
    it('should remove RPC from list', async () => {
      const rpcs: Rpc[] = [
        {uri: 'https://rpc1.com'} as Rpc,
        {uri: 'https://rpc2.com'} as Rpc,
      ];
      const toDelete: Rpc = {uri: 'https://rpc1.com'} as Rpc;
      await deleteCustomRpc(rpcs, toDelete);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.CUSTOM_RPC_LIST,
        JSON.stringify([{uri: 'https://rpc2.com'}]),
      );
    });
  });

  describe('getRPCUri', () => {
    it('should return URI from Rpc object', () => {
      const rpc: Rpc = {uri: 'https://rpc.com'} as Rpc;
      expect(getRPCUri(rpc)).toBe('https://rpc.com');
    });

    it('should return string as-is', () => {
      expect(getRPCUri('https://rpc.com')).toBe('https://rpc.com');
    });
  });

  describe('checkRpcStatus', () => {
    it('should return true for healthy RPC', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({data: {}});
      const result = await checkRpcStatus('https://rpc.com');
      expect(result).toBe(true);
    });

    it('should return false for RPC with error', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({data: {error: true}});
      const result = await checkRpcStatus('https://rpc.com');
      expect(result).toBe(false);
    });

    it('should return false on request failure', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      const result = await checkRpcStatus('https://rpc.com');
      expect(result).toBe(false);
    });

    it('should use default URL for DEFAULT or api.hive.blog', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({data: {}});
      await checkRpcStatus('DEFAULT');
      expect(axios.get).toHaveBeenCalledWith('https://api.hive.blog', {
        timeout: 10000,
      });
    });
  });
});
