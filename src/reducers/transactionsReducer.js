import {INIT_TRANSACTIONS, ADD_TRANSACTIONS} from '../actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case INIT_TRANSACTIONS:
      return payload;
    case ADD_TRANSACTIONS:
      //check if the transaction is received for the same user (username is part of the unique key)
      if (state[0].key.split('!')[0] === payload[0].key.split('!')[0]) {
        return [...state, ...payload];
      } else {
        return state;
      }
    default:
      return state;
  }
};
