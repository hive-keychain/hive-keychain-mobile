import {actionPayload, account} from 'actions/interfaces';
import {
  ADD_ACCOUNT,
  INIT_ACCOUNTS,
  LOCK,
  FORGET_ACCOUNTS,
  FORGET_ACCOUNT,
  UPDATE_ACCOUNTS,
} from 'actions/types';

export default (
  state: [account?] = [],
  {type, payload}: actionPayload<any>,
) => {
  switch (type) {
    case ADD_ACCOUNT:
      return [...state, payload];
    case FORGET_ACCOUNT:
      return state.filter((e) => e!.name !== payload);
    case INIT_ACCOUNTS:
    case UPDATE_ACCOUNTS:
      return payload;
    case LOCK:
      return [];
    case FORGET_ACCOUNTS:
      return [];
    default:
      return state;
  }
};
