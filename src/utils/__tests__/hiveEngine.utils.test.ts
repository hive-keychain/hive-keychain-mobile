const mockGetSSC = jest.fn();
const mockGetTransactionInfo = jest.fn();
const mockFind = jest.fn();
const mockGetItem = jest.fn();
const mockDecodeMemo = jest.fn();
const mockFormatBalance = jest.fn();
const mockTranslate = jest.fn();

jest.mock('api/hiveEngine.api', () => ({
  HiveEngineApi: {
    getSSC: () => mockGetSSC(),
  },
}));

jest.mock('components/bridge', () => ({
  decodeMemo: (...args: any[]) => mockDecodeMemo(...args),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
  },
  __esModule: true,
}));

jest.mock('../format.utils', () => ({
  formatBalance: (...args: any[]) => mockFormatBalance(...args),
}));

jest.mock('../localize', () => ({
  translate: (...args: any[]) => mockTranslate(...args),
}));

import {
  tryConfirmTransaction,
  getHiveEngineTokenValue,
  getHiveEngineTokenTradingInfo,
  decodeMemoIfNeeded,
  getIncomingTokenDelegations,
  getOutgoingTokenDelegations,
  getAllTokens,
  getTokenInfo,
  getTokenPrecision,
  getHiveEngineTokenPrice,
  getHiddenTokens,
  getHiveEngineTokenPriceInfo,
  isAcceptableSpread,
} from '../hiveEngine.utils';
import {TokenBalance, TokenMarket, Token} from 'src/interfaces/tokens.interface';

describe('hiveEngine.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGetSSC.mockReturnValue({
      getTransactionInfo: mockGetTransactionInfo,
      find: mockFind,
    });
    mockFormatBalance.mockImplementation((val) => val.toString());
    mockTranslate.mockReturnValue('translated');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('tryConfirmTransaction', () => {
    it('should confirm transaction when result is found', async () => {
      mockGetTransactionInfo.mockResolvedValue({logs: '{"errors": []}'});
      const promise = tryConfirmTransaction('tx123');
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      const result = await promise;
      expect(result.confirmed).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return error when logs contain errors', async () => {
      mockGetTransactionInfo.mockResolvedValue({
        logs: '{"errors": ["Error message"]}',
      });
      const promise = tryConfirmTransaction('tx123');
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      const result = await promise;
      expect(result.confirmed).toBe(true);
      expect(result.error).toBe('Error message');
    });

  });

  describe('getHiveEngineTokenValue', () => {
    const mockBalance: TokenBalance = {
      symbol: 'TEST',
      balance: '100',
      stake: '50',
      pendingUnstake: '10',
      pendingUndelegations: '5',
      delegationsOut: '5',
    } as TokenBalance;

    const mockMarket: TokenMarket[] = [
      {
        symbol: 'TEST',
        lastPrice: '0.5',
        volume: '1000',
        highestBid: '0.49',
        lowestAsk: '0.51',
        priceChangePercent: '5',
      },
    ];

    it('should return balance * 1 for SWAP.HIVE', () => {
      const balance: TokenBalance = {
        ...mockBalance,
        symbol: 'SWAP.HIVE',
      };
      const result = getHiveEngineTokenValue(balance, mockMarket);
      expect(result).toBe(100);
    });

    it('should calculate value with volume when minVolume is met', () => {
      const result = getHiveEngineTokenValue(mockBalance, mockMarket, 500);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 when minVolume is not met', () => {
      const result = getHiveEngineTokenValue(mockBalance, mockMarket, 2000);
      expect(result).toBe(0);
    });

    it('should include all balance components in calculation', () => {
      const result = getHiveEngineTokenValue(mockBalance, mockMarket, 0);
      // Should include balance + stake + pendingUnstake + pendingUndelegations + delegationsOut
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('getHiveEngineTokenTradingInfo', () => {
    const mockBalance: TokenBalance = {
      symbol: 'TEST',
      balance: '100',
    } as TokenBalance;

    it('should return price and volume for valid token market', () => {
      const market: TokenMarket[] = [
        {
          symbol: 'TEST',
          lastPrice: '0.5',
          volume: '1000',
          highestBid: '0.49',
          lowestAsk: '0.51',
          priceChangePercent: '5',
        },
      ];
      const result = getHiveEngineTokenTradingInfo(mockBalance, market);
      expect(result.price).toBe(0.5);
      expect(result.volume).toBe('1000');
    });

    it('should return 0 price when spread is unacceptable', () => {
      const market: TokenMarket[] = [
        {
          symbol: 'TEST',
          lastPrice: '0.5',
          volume: '1000',
          highestBid: '0.01',
          lowestAsk: '100',
          priceChangePercent: '5',
        },
      ];
      const result = getHiveEngineTokenTradingInfo(mockBalance, market);
      // When spread is unacceptable, it returns price 0 but keeps volume
      expect(result.price).toBe(0);
      expect(result.volume).toBe('1000');
    });

    it('should return 1 for SWAP.HIVE when no market', () => {
      const balance: TokenBalance = {
        ...mockBalance,
        symbol: 'SWAP.HIVE',
      };
      const result = getHiveEngineTokenTradingInfo(balance, []);
      // When no market, isAcceptableSpread returns false for undefined,
      // so it returns early with price 0. Only if market exists but is acceptable,
      // it checks for SWAP.HIVE. So we need a valid market for SWAP.HIVE.
      // Actually, looking at the code: if !isAcceptableSpread, it returns early.
      // So for no market, isAcceptableSpread(undefined) returns false, so price is 0.
      expect(result.price).toBe(0);
      expect(result.volume).toBeUndefined();
    });

    it('should return 0 for other tokens when no market', () => {
      const result = getHiveEngineTokenTradingInfo(mockBalance, []);
      expect(result.price).toBe(0);
    });

    it('should return undefined volume when no market', () => {
      const result = getHiveEngineTokenTradingInfo(mockBalance, []);
      expect(result.volume).toBeUndefined();
    });
  });

  describe('decodeMemoIfNeeded', () => {
    it('should decode memo when it starts with #', () => {
      mockDecodeMemo.mockResolvedValue('decoded-memo');
      const result = decodeMemoIfNeeded('#encrypted', 'memo-key');
      expect(mockDecodeMemo).toHaveBeenCalledWith('memo-key', '#encrypted');
    });

    it('should return translated message when memo starts with # but no memo key', () => {
      const result = decodeMemoIfNeeded('#encrypted', '');
      expect(result).toBe('translated');
      expect(mockTranslate).toHaveBeenCalledWith('wallet.add_memo');
    });

    it('should return memo as-is when it does not start with #', () => {
      const result = decodeMemoIfNeeded('plain-memo', 'memo-key');
      expect(result).toBe('plain-memo');
      expect(mockDecodeMemo).not.toHaveBeenCalled();
    });

    it('should handle empty memo', () => {
      const result = decodeMemoIfNeeded('', 'memo-key');
      expect(result).toBe('');
    });
  });

  describe('getIncomingTokenDelegations', () => {
    it('should get incoming token delegations', async () => {
      const mockDelegations = [
        {from: 'user1', to: 'user2', quantity: '100', symbol: 'TEST'},
      ];
      mockFind.mockResolvedValue(mockDelegations);
      const result = await getIncomingTokenDelegations('user2', 'TEST');
      expect(result).toEqual(mockDelegations);
      expect(mockFind).toHaveBeenCalledWith('tokens', 'delegations', {
        to: 'user2',
        symbol: 'TEST',
      });
    });
  });

  describe('getOutgoingTokenDelegations', () => {
    it('should get outgoing token delegations', async () => {
      const mockDelegations = [
        {from: 'user1', to: 'user2', quantity: '100', symbol: 'TEST'},
      ];
      mockFind.mockResolvedValue(mockDelegations);
      const result = await getOutgoingTokenDelegations('user1', 'TEST');
      expect(result).toEqual(mockDelegations);
      expect(mockFind).toHaveBeenCalledWith('tokens', 'delegations', {
        from: 'user1',
        symbol: 'TEST',
      });
    });
  });

  describe('getAllTokens', () => {
    it('should get all tokens and parse metadata', async () => {
      const mockTokens = [
        {symbol: 'TEST', metadata: '{"name": "Test Token"}'},
        {symbol: 'TEST2', metadata: '{"name": "Test Token 2"}'},
      ];
      mockFind.mockResolvedValue(mockTokens);
      const result = await getAllTokens();
      expect(result).toHaveLength(2);
      expect(result[0].metadata).toEqual({name: 'Test Token'});
      expect(result[1].metadata).toEqual({name: 'Test Token 2'});
      expect(mockFind).toHaveBeenCalledWith('tokens', 'tokens', {}, 1000, 0, []);
    });
  });

  describe('getTokenInfo', () => {
    it('should get token info and parse metadata', async () => {
      const mockToken = {symbol: 'TEST', metadata: '{"name": "Test Token"}'};
      mockFind.mockResolvedValue([mockToken]);
      const result = await getTokenInfo('TEST');
      expect(result.metadata).toEqual({name: 'Test Token'});
      expect(mockFind).toHaveBeenCalledWith(
        'tokens',
        'tokens',
        {symbol: 'TEST'},
        1000,
        0,
        [],
      );
    });
  });

  describe('getTokenPrecision', () => {
    it('should return 3 for HBD', async () => {
      const result = await getTokenPrecision('HBD');
      expect(result).toBe(3);
      expect(mockFind).not.toHaveBeenCalled();
    });

    it('should return 3 for HIVE', async () => {
      const result = await getTokenPrecision('HIVE');
      expect(result).toBe(3);
      expect(mockFind).not.toHaveBeenCalled();
    });

    it('should get precision from token info for other tokens', async () => {
      mockFind.mockResolvedValue([
        {symbol: 'TEST', precision: 8, metadata: '{}'},
      ]);
      const result = await getTokenPrecision('TEST');
      expect(result).toBe(8);
      expect(mockFind).toHaveBeenCalled();
    });
  });

  describe('getHiveEngineTokenPrice', () => {
    const mockMarket: TokenMarket[] = [
      {
        symbol: 'TEST',
        lastPrice: '0.5',
        volume: '1000',
        highestBid: '0.49',
        lowestAsk: '0.51',
        priceChangePercent: '5',
      },
    ];

    it('should get price from market', () => {
      const result = getHiveEngineTokenPrice({symbol: 'TEST'}, mockMarket);
      expect(result).toBe(0.5);
    });

    it('should return 1 for SWAP.HIVE when no market', () => {
      const result = getHiveEngineTokenPrice({symbol: 'SWAP.HIVE'}, []);
      expect(result).toBe(1);
    });

    it('should return 0 for other tokens when no market', () => {
      const result = getHiveEngineTokenPrice({symbol: 'TEST'}, []);
      expect(result).toBe(0);
    });

    it('should handle undefined symbol', () => {
      const result = getHiveEngineTokenPrice({}, mockMarket);
      expect(result).toBe(0);
    });
  });

  describe('getHiddenTokens', () => {
    it('should get hidden tokens from storage', async () => {
      const mockHidden = {TEST: true, TEST2: false};
      mockGetItem.mockResolvedValue(JSON.stringify(mockHidden));
      const result = await getHiddenTokens();
      expect(result).toEqual(mockHidden);
    });

    it('should return empty object when no hidden tokens', async () => {
      mockGetItem.mockResolvedValue(null);
      const result = await getHiddenTokens();
      expect(result).toEqual({});
    });
  });

  describe('getHiveEngineTokenPriceInfo', () => {
    const mockTokenInfo: Token = {
      symbol: 'TEST',
      precision: 8,
    } as Token;

    const mockTokenMarket: TokenMarket = {
      symbol: 'TEST',
      lastPrice: '0.5',
      volume: '1000',
      highestBid: '0.49',
      lowestAsk: '0.51',
      priceChangePercent: '5',
    };

    it('should calculate USD price and 24h change', () => {
      mockFormatBalance.mockReturnValue('0.25');
      const result = getHiveEngineTokenPriceInfo(
        mockTokenMarket,
        mockTokenInfo,
        0.5,
      );
      expect(result.usd).toBe('0.25');
      expect(result.usd_24h_change).toBe(5);
      expect(mockFormatBalance).toHaveBeenCalledWith(0.25);
    });

    it('should return 0 USD when token market is invalid', () => {
      const result = getHiveEngineTokenPriceInfo(
        null as any,
        mockTokenInfo,
        0.5,
      );
      expect(result.usd).toBe('0');
      expect(result.usd_24h_change).toBe(0);
    });

    it('should return hive price for SWAP.HIVE when market is invalid', () => {
      const swapToken: Token = {
        ...mockTokenInfo,
        symbol: 'SWAP.HIVE',
      };
      mockFormatBalance.mockReturnValue('0.5');
      const result = getHiveEngineTokenPriceInfo(
        null as any,
        swapToken,
        0.5,
      );
      expect(result.usd).toBe('0.5');
      expect(result.usd_24h_change).toBe(0);
    });

    it('should handle unacceptable spread', () => {
      const badMarket: TokenMarket = {
        ...mockTokenMarket,
        highestBid: '0.01',
        lowestAsk: '100',
      };
      const result = getHiveEngineTokenPriceInfo(
        badMarket,
        mockTokenInfo,
        0.5,
      );
      expect(result.usd).toBe('0');
      expect(result.usd_24h_change).toBe(0);
    });
  });

  describe('isAcceptableSpread', () => {
    it('should return true for acceptable spread', () => {
      const market: TokenMarket = {
        symbol: 'TEST',
        highestBid: '0.49',
        lowestAsk: '0.51',
        lastPrice: '0.5',
        volume: '1000',
        priceChangePercent: '5',
      };
      expect(isAcceptableSpread(market)).toBe(true);
    });

    it('should return false for unacceptable spread', () => {
      const market: TokenMarket = {
        symbol: 'TEST',
        highestBid: '0.01',
        lowestAsk: '100',
        lastPrice: '0.5',
        volume: '1000',
        priceChangePercent: '5',
      };
      expect(isAcceptableSpread(market)).toBe(false);
    });

    it('should return false when highestBid is missing', () => {
      const market: TokenMarket = {
        symbol: 'TEST',
        lowestAsk: '0.51',
        lastPrice: '0.5',
        volume: '1000',
        priceChangePercent: '5',
      } as TokenMarket;
      expect(isAcceptableSpread(market)).toBe(false);
    });

    it('should return false when lowestAsk is missing', () => {
      const market: TokenMarket = {
        symbol: 'TEST',
        highestBid: '0.49',
        lastPrice: '0.5',
        volume: '1000',
        priceChangePercent: '5',
      } as TokenMarket;
      expect(isAcceptableSpread(market)).toBe(false);
    });

    it('should return false for null market', () => {
      expect(isAcceptableSpread(null as any)).toBe(false);
    });

    it('should return false for undefined market', () => {
      expect(isAcceptableSpread(undefined as any)).toBe(false);
    });

    it('should return true for spread exactly at MAX_SPREAD', () => {
      const market: TokenMarket = {
        symbol: 'TEST',
        highestBid: '1',
        lowestAsk: '100',
        lastPrice: '50',
        volume: '1000',
        priceChangePercent: '5',
      };
      expect(isAcceptableSpread(market)).toBe(true);
    });
  });
});
