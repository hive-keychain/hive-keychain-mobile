import {ADD_ACCOUNT, INIT_ACCOUNTS, LOCK} from '../actions/types';

export default (state = [], {type, payload}) => {
  //console.log('a', state, type, payload);
  switch (type) {
    case ADD_ACCOUNT:
      return [...state, payload];
    case INIT_ACCOUNTS:
      return payload;
    case LOCK:
      return [];
    default:
      return state;
  }
};
