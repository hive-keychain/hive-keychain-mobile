import currencyPricesReducer from '../currencyPrices';
import {GET_CURRENCY_PRICES} from 'actions/types';
import {CurrencyPrices} from 'actions/interfaces';

describe('currencyPrices reducer', () => {
  const initialState = {
    bitcoin: {},
    hive: {},
    hive_dollar: {},
  };

  it('should return initial state', () => {
    expect(currencyPricesReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle GET_CURRENCY_PRICES', () => {
    const prices: CurrencyPrices = {
      bitcoin: {usd: 50000},
      hive: {usd: 0.5},
      hive_dollar: {usd: 1.0},
    };
    const action = {
      type: GET_CURRENCY_PRICES,
      payload: prices,
    };
    const result = currencyPricesReducer(initialState, action);
    expect(result).toEqual(prices);
  });

  it('should replace entire prices object', () => {
    const oldPrices: CurrencyPrices = {
      bitcoin: {usd: 40000},
      hive: {usd: 0.4},
      hive_dollar: {usd: 0.9},
    };
    const newPrices: CurrencyPrices = {
      bitcoin: {usd: 60000},
      hive: {usd: 0.6},
      hive_dollar: {usd: 1.1},
    };
    const state = currencyPricesReducer(initialState, {
      type: GET_CURRENCY_PRICES,
      payload: oldPrices,
    });
    const result = currencyPricesReducer(state, {
      type: GET_CURRENCY_PRICES,
      payload: newPrices,
    });
    expect(result).toEqual(newPrices);
    expect(result.bitcoin.usd).toBe(60000);
  });

  it('should return state unchanged for unknown action', () => {
    const state: CurrencyPrices = {
      bitcoin: {usd: 50000},
      hive: {usd: 0.5},
      hive_dollar: {usd: 1.0},
    };
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = currencyPricesReducer(state, action);
    expect(result).toEqual(state);
  });
});
















