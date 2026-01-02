import {
  setRpc,
  setHiveEngineRpc,
  setAccountHistoryRpc,
  getSettings,
} from '../settings';
import {
  SET_RPC,
  SET_HIVE_ENGINE_RPC,
  SET_HIVE_ACCOUNT_HISTORY_RPC,
  SET_MOBILE_SETTINGS,
} from '../types';
import KeychainApi from 'api/keychain.api';
import {Rpc} from '../interfaces';

jest.mock('api/keychain.api');

describe('settings actions', () => {
  describe('setRpc', () => {
    it('should create action to set RPC', () => {
      const rpc: Rpc = {
        uri: 'https://api.hive.blog',
        testnet: false,
      } as Rpc;
      const action = setRpc(rpc);
      expect(action.type).toBe(SET_RPC);
      expect(action.payload?.rpc).toEqual(rpc);
    });
  });

  describe('setHiveEngineRpc', () => {
    it('should create action to set Hive Engine RPC', () => {
      const rpc = 'https://api.hive-engine.com';
      const action = setHiveEngineRpc(rpc);
      expect(action.type).toBe(SET_HIVE_ENGINE_RPC);
      expect(action.payload?.hiveEngineRpc).toBe(rpc);
    });
  });

  describe('setAccountHistoryRpc', () => {
    it('should create action to set account history RPC', () => {
      const rpc = 'https://api.hive.blog';
      const action = setAccountHistoryRpc(rpc);
      expect(action.type).toBe(SET_HIVE_ACCOUNT_HISTORY_RPC);
      expect(action.payload?.accountHistoryAPIRpc).toBe(rpc);
    });
  });

  describe('getSettings', () => {
    it('should fetch and dispatch mobile settings', async () => {
      const mockSettings = {
        platformRelevantFeatures: {
          swap: ['android'],
          externalOnboarding: ['ios'],
        },
      };
      (KeychainApi.get as jest.Mock).mockResolvedValueOnce({
        data: mockSettings,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunk = getSettings();

      await thunk(dispatch, getState, undefined);

      expect(KeychainApi.get).toHaveBeenCalledWith('mobile-settings');
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_MOBILE_SETTINGS,
        payload: {mobileSettings: mockSettings},
      });
    });
  });
});


















