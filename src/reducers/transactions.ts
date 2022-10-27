import {ActionPayload, Transaction, Transactions} from 'actions/interfaces';
import {
  ACTIVE_ACCOUNT,
  ADD_TRANSACTIONS,
  INIT_TRANSACTIONS,
} from 'actions/types';

export default (
  state: Transactions = {loading: false, list: []},
  {type, payload}: ActionPayload<Transaction[]>,
) => {
  console.log({type, payload}); //TODO to remove
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
