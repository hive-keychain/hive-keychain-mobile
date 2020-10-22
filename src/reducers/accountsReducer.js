import {
  ADD_ACCOUNT,
  INIT_ACCOUNTS,
  LOCK,
  FORGET_ACCOUNTS,
  FORGET_ACCOUNT,
} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case ADD_ACCOUNT:
      return [...state, payload];
    case FORGET_ACCOUNT:
      return state.filter((e) => e.name !== payload);
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
