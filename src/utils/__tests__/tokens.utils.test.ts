import {ReceiveTransferProps} from 'navigators/Root.types';
import {
  BlockchainTransactionUtils,
  TokenUtils,
  getAllTokens,
  getTokenInfo,
  getTokenPrecision,
  getUserBalance,
} from '../tokens.utils';
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

    describe('tryConfirmTransaction', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns confirmed with first log error when present', async () => {
        jest
          .spyOn(BlockchainTransactionUtils, 'getDelayedTransactionInfo')
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({
            logs: JSON.stringify({errors: ['engine-fail']}),
          });

        const result = await BlockchainTransactionUtils.tryConfirmTransaction(
          'trx-1',
        );

        expect(result.confirmed).toBe(true);
        expect(result.error).toBe('engine-fail');
      });

      it('returns confirmed with null error when logs have no errors', async () => {
        jest
          .spyOn(BlockchainTransactionUtils, 'getDelayedTransactionInfo')
          .mockResolvedValue({
            logs: JSON.stringify({}),
          });

        const result = await BlockchainTransactionUtils.tryConfirmTransaction(
          'trx-2',
        );

        expect(result.confirmed).toBe(true);
        expect(result.error).toBeNull();
      });

      it('returns not confirmed when transaction info never arrives', async () => {
        jest
          .spyOn(BlockchainTransactionUtils, 'getDelayedTransactionInfo')
          .mockResolvedValue(null);

        const result = await BlockchainTransactionUtils.tryConfirmTransaction(
          'trx-3',
        );

        expect(result.confirmed).toBe(false);
      });
    });
  });

  describe('getAllTokens', () => {
    it('paginates until a non-full page is returned', async () => {
      const pageFull = Array.from({length: 1000}, (_, i) => ({
        symbol: `A${i}`,
        metadata: '{}',
        precision: 3,
      }));
      const pagePartial = Array.from({length: 500}, (_, i) => ({
        symbol: `B${i}`,
        metadata: '{}',
        precision: 3,
      }));
      const getMock = HiveEngineApi.get as jest.Mock;
      getMock.mockClear();
      getMock.mockImplementation(async (params: {offset?: number}) => {
        if (params.offset === 0) {
          return pageFull;
        }
        if (params.offset === 1000) {
          return pagePartial;
        }
        return [];
      });

      const all = await getAllTokens();

      expect(all).toHaveLength(1500);
      expect(HiveEngineApi.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getTokenInfo', () => {
    it('returns parsed token metadata for the first match', async () => {
      (HiveEngineApi.get as jest.Mock).mockResolvedValueOnce([
        {
          symbol: 'ZZZ',
          precision: 4,
          metadata: '{"foo":1}',
        },
      ]);

      const token = await getTokenInfo('ZZZ');

      expect(token.symbol).toBe('ZZZ');
      expect(token.precision).toBe(4);
      expect(token.metadata).toEqual({foo: 1});
    });
  });

  describe('TokenUtils.searchForTransaction', () => {
    it('returns matching history row for amount and memo', async () => {
      const params: ReceiveTransferProps = [
        'transfer',
        {
          to: 'alice',
          amount: '12.5 BEE',
          memo: 'note',
        },
      ];
      const row = {
        timestamp: 2_000_000_000,
        quantity: '12.5',
        memo: 'note',
      };
      const mockGet = jest.fn().mockResolvedValue({data: [row]});
      (HiveEngineApi.getHistoryApi as jest.Mock).mockReturnValue({
        get: mockGet,
      });

      const found = await TokenUtils.searchForTransaction(
        params,
        new Date(0),
      );

      expect(found).toEqual(row);
      expect(mockGet).toHaveBeenCalledWith('accountHistory', {
        params: {
          account: 'alice',
          symbol: 'BEE',
          type: 'user',
          offset: 0,
          limit: 1,
        },
      });
    });
  });
});
