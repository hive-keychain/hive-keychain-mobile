import {actionPayload, transactions, transaction} from 'actions/interfaces';
import {
  INIT_TRANSACTIONS,
  ADD_TRANSACTIONS,
  ACTIVE_ACCOUNT,
} from 'actions/types';

export default (
  state: transactions = {loading: false, list: []},
  {type, payload}: actionPayload<transaction[]>,
) => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {loading: true, list: []};
    case INIT_TRANSACTIONS:
      return {loading: false, list: payload!};
    case ADD_TRANSACTIONS:
      if (
        !state.list[0] ||
        state.list[0].key.split('!')[0] === payload![0].key.split('!')[0]
      ) {
        return {...state, list: [...state.list, ...payload!]};
      } else {
        return state;
      }
    default:
      return state;
  }
};
