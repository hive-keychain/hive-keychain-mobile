import {TokenUtils, BlockchainTransactionUtils} from '../tokens.utils';
import {getTokenPrecision, getUserBalance} from '../tokens.utils';
import {HiveEngineApi} from 'api/hiveEngine.api';

jest.mock('api/hiveEngine.api');

describe('tokens.utils', () => {
  describe('getTokenPrecision', () => {
    it('should return 3 for HBD', async () => {
      const result = await getTokenPrecision('HBD');
      expect(result).toBe(3);
    });

    it('should return 3 for HIVE', async () => {
      const result = await getTokenPrecision('HIVE');
      expect(result).toBe(3);
    });

    it('should fetch precision for other tokens', async () => {
      const mockToken = {precision: 8, metadata: '{}'};
      (HiveEngineApi.get as jest.Mock).mockResolvedValueOnce([mockToken]);
      const result = await getTokenPrecision('BEE');
      expect(result).toBe(8);
    });
  });

  describe('getUserBalance', () => {
    it('should fetch user token balances', async () => {
      const mockBalances = [
        {symbol: 'BEE', balance: '1000'},
        {symbol: 'SWAP.HIVE', balance: '500'},
      ];
      (HiveEngineApi.get as jest.Mock).mockResolvedValueOnce(mockBalances);
      const result = await getUserBalance('testuser');
      expect(result).toEqual(mockBalances);
      expect(HiveEngineApi.get).toHaveBeenCalledWith({
        contract: 'tokens',
        table: 'balances',
        query: {account: 'testuser'},
        indexes: [],
        limit: 1000,
        offset: 0,
      });
    });
  });

  describe('BlockchainTransactionUtils', () => {
    describe('getDelayedTransactionInfo', () => {
      it('should fetch transaction info after delay', async () => {
        jest.useFakeTimers();
        const mockTransaction = {id: '123', logs: '{}'};
        const mockGetSSC = {
          getTransactionInfo: jest.fn().mockResolvedValue(mockTransaction),
        };
        (HiveEngineApi.getSSC as jest.Mock).mockReturnValue(mockGetSSC);

        const promise = BlockchainTransactionUtils.getDelayedTransactionInfo('123');
        jest.advanceTimersByTime(1000);
        const result = await promise;

        expect(result).toEqual(mockTransaction);
        expect(mockGetSSC.getTransactionInfo).toHaveBeenCalledWith('123');
        jest.useRealTimers();
      });
    });
  });
});
