import {GET_BITTREX_PRICE} from 'actions/types';

const bittrexReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case GET_BITTREX_PRICE:
      return payload;
    default:
      return state;
  }
};

export default bittrexReducer;
