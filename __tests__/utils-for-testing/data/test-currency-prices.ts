import {Currency, CurrencyPrices} from 'actions/interfaces';

export default {
  _default: {
    bitcoin: {
      usd: 30000,
      usd_24h_change: 20,
    } as Currency,
    hive: {
      usd: 0.59,
      usd_24h_change: 0.1,
    } as Currency,
    hive_dollar: {
      usd: 1,
      usd_24h_change: 0.01,
    } as Currency,
  } as CurrencyPrices,
};
