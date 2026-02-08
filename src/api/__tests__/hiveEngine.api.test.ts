import {HiveEngineApi} from '../hiveEngine.api';
import {HiveEngineConfigUtils} from 'utils/hiveEngineConfig.utils';
import axios from 'axios';

jest.mock('utils/hiveEngineConfig.utils');
jest.mock('sscjs');

global.fetch = jest.fn();

describe('HiveEngineApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSSC', () => {
    it('should return SSC instance with configured API', () => {
      (HiveEngineConfigUtils.getApi as jest.Mock).mockReturnValueOnce(
        'https://api.hive-engine.com',
      );
      const SSC = require('sscjs');
      const result = HiveEngineApi.getSSC();
      expect(SSC).toHaveBeenCalledWith('https://api.hive-engine.com');
    });
  });

  describe('getHistoryApi', () => {
    it('should return axios instance with history API URL', () => {
      (HiveEngineConfigUtils.getAccountHistoryApi as jest.Mock).mockReturnValueOnce(
        'https://history-api.hive-engine.com',
      );
      const result = HiveEngineApi.getHistoryApi();
      expect(result.defaults.baseURL).toBe('https://history-api.hive-engine.com');
    });
  });

  describe('get', () => {
    it('should fetch data from Hive Engine API', async () => {
      (HiveEngineConfigUtils.getApi as jest.Mock).mockReturnValueOnce(
        'https://api.hive-engine.com',
      );
      const mockResponse = {
        json: jest.fn().mockResolvedValueOnce({
          result: [{symbol: 'BEE', name: 'Bee'}],
        }),
        status: 200,
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const params = {
        contract: 'tokens',
        table: 'tokens',
        query: {},
        limit: 1000,
        offset: 0,
        indexes: [],
      };
      const result = await HiveEngineApi.get(params);
      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual([{symbol: 'BEE', name: 'Bee'}]);
    });

    it('should handle non-200 status errors', async () => {
      (HiveEngineConfigUtils.getApi as jest.Mock).mockReturnValueOnce(
        'https://api.hive-engine.com',
      );
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValueOnce({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const params = {
        contract: 'tokens',
        table: 'tokens',
        query: {},
        limit: 1000,
        offset: 0,
        indexes: [],
      };
      await expect(HiveEngineApi.get(params)).rejects.toThrow();
    });
  });
});
