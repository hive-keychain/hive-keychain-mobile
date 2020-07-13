import {
  ADD_ACCOUNT,
  INIT_ACCOUNTS,
  LOCK,
  FORGET_ACCOUNTS,
} from '../actions/types';

export default (state = [], {type, payload}) => {
  //console.log('a', state, type, payload);
  switch (type) {
    case ADD_ACCOUNT:
      return [...state, payload];
    case INIT_ACCOUNTS:
      return payload;
    case LOCK:
      return [];
    case FORGET_ACCOUNTS:
      return [];
    default:
      return state;
  }
};
