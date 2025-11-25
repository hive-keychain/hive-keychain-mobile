import {ExtendedAccount} from '@hiveio/dhive';
import {CurrencyPrices} from 'actions/interfaces';
import api from 'api/keychain.api';
import {TokenBalance, TokenMarket} from 'src/interfaces/tokens.interface';
import {getAccountValue, getPrices} from '../price.utils';

jest.mock('api/keychain.api');
jest.mock('../hiveEngine.utils', () => ({
  getHiddenTokens: jest.fn(() => Promise.resolve({})),
  getHiveEngineTokenValue: jest.fn(() => 0),
}));

describe('price.utils', () => {
  describe('getPrices', () => {
    it('should fetch prices from API', async () => {
      const mockPrices = {
        bitcoin: {usd: 50000},
        hive: {usd: 0.5},
        hive_dollar: {usd: 1.0},
      };
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockPrices,
      });

      const result = await getPrices();
      expect(result).toEqual(mockPrices);
      expect(api.get).toHaveBeenCalledWith('/hive/v2/price');
    });
  });

  describe('getAccountValue', () => {
    const mockAccount: ExtendedAccount = {
      name: 'testuser',
      balance: '100.000 HIVE',
      hbd_balance: '50.000 HBD',
      vesting_shares: '1000000.000000 VESTS',
      savings_balance: '10.000 HIVE',
      savings_hbd_balance: '5.000 HBD',
    } as ExtendedAccount;

    const mockPrices: CurrencyPrices = {
      hive: {usd: 0.5},
      hive_dollar: {usd: 1.0},
      bitcoin: {},
    };

    const mockProps = {
      total_vesting_fund_hive: '1000000',
      total_vesting_shares: '2000000',
    } as any;

    it('should calculate account value', async () => {
      const userTokens: TokenBalance[] = [];
      const tokenMarket: TokenMarket[] = [];

      const result = await getAccountValue(
        mockAccount,
        mockPrices,
        mockProps,
        userTokens,
        tokenMarket,
      );

      expect(typeof result).toBe('string');
      expect(parseFloat(result as string)).toBeGreaterThan(0);
    });

    it('should return 0 if prices are missing', async () => {
      const invalidPrices: CurrencyPrices = {
        hive: {},
        hive_dollar: {},
        bitcoin: {},
      };

      const result = await getAccountValue(
        mockAccount,
        invalidPrices,
        mockProps,
        [],
        [],
      );

      expect(result).toBe(0);
    });

    it('should include user tokens in calculation', async () => {
      const {getHiveEngineTokenValue} = require('../hiveEngine.utils');
      (getHiveEngineTokenValue as jest.Mock).mockReturnValue(100);

      const userTokens: TokenBalance[] = [
        {
          symbol: 'BEE',
          balance: '1000',
          stake: '0',
          pendingUnstake: '0',
          delegationsIn: '0',
          delegationsOut: '0',
          pendingUndelegations: '0',
        } as TokenBalance,
      ];
      const tokenMarket: TokenMarket[] = [
        {
          symbol: 'BEE',
          highestBid: '0',
          lastDayPrice: '0',
          lastDayPriceExpiration: 0,
          lastPrice: '0',
          lowestAsk: '0',
          priceChangeHive: '0',
          priceChangePercent: '0',
          volume: '0',
          volumeExpiration: 0,
          _id: 0,
        } as unknown as TokenMarket,
      ];

      const result = await getAccountValue(
        mockAccount,
        mockPrices,
        mockProps,
        userTokens,
        tokenMarket,
      );

      expect(getHiveEngineTokenValue).toHaveBeenCalled();
      expect(parseFloat(result as string)).toBeGreaterThan(0);
    });
  });
});
