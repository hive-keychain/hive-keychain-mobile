import {ActionPayload, CurrencyPrices} from 'actions/interfaces';
import {GET_CURRENCY_PRICES} from 'actions/types';

const currencyPricesReducer = (
  state: CurrencyPrices = {bitcoin: {}, hive: {}, hive_dollar: {}},
  {type, payload}: ActionPayload<CurrencyPrices>,
) => {
  switch (type) {
    case GET_CURRENCY_PRICES:
      return payload!;
    default:
      return state;
  }
};

export default currencyPricesReducer;
