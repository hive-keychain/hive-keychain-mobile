import {INIT_TRANSACTIONS, ADD_TRANSACTIONS} from '../actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case INIT_TRANSACTIONS:
      return payload;
    case ADD_TRANSACTIONS:
      return [...state, ...payload];
    default:
      return state;
  }
};
