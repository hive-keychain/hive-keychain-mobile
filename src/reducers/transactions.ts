import {actionPayload} from 'actions/interfaces';
import {
  INIT_TRANSACTIONS,
  ADD_TRANSACTIONS,
  ACTIVE_ACCOUNT,
} from 'actions/types';

interface transaction {
  key: string;
  amount: string;
  from: string;
  memo: string;
  timestamp: string;
  to: string;
  type: string;
}
interface transactions {
  loading: boolean;
  list: [transaction?];
}

export default (
  state: transactions = {loading: false, list: []},
  {type, payload}: actionPayload<[transaction] | undefined>,
) => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {loading: true, list: []};
    case INIT_TRANSACTIONS:
      return {loading: false, list: payload};
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
