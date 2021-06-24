import {ActionPayload, Bittrex} from 'actions/interfaces';
import {GET_BITTREX_PRICE} from 'actions/types';

const bittrexReducer = (
  state: Bittrex = {btc: {}, hive: {}, hbd: {}},
  {type, payload}: ActionPayload<Bittrex>,
) => {
  switch (type) {
    case GET_BITTREX_PRICE:
      return payload!;
    default:
      return state;
  }
};

export default bittrexReducer;
