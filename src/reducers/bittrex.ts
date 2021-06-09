import {actionPayload, bittrex} from 'actions/interfaces';
import {GET_BITTREX_PRICE} from 'actions/types';

const bittrexReducer = (
  state: bittrex = {btc: {}, hive: {}, hbd: {}},
  {type, payload}: actionPayload<bittrex>,
) => {
  switch (type) {
    case GET_BITTREX_PRICE:
      return payload;
    default:
      return state;
  }
};

export default bittrexReducer;
