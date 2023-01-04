import {ActionPayload} from 'actions/interfaces';
import {
  ACTIVE_ACCOUNT,
  ADD_TRANSACTIONS,
  CLEAR_USER_TRANSACTIONS,
  INIT_TRANSACTIONS,
} from 'actions/types';
import {Transaction, Transactions} from 'src/interfaces/transaction.interface';
import ArrayUtils from 'utils/array.utils';

export default (
  state: Transactions = {loading: false, list: [], lastUsedStart: -1},
  {type, payload}: ActionPayload<[Transaction[], number]>,
) => {
  switch (type) {
    case CLEAR_USER_TRANSACTIONS:
      return {loading: false, list: [], lastUsedStart: -1};
    case ACTIVE_ACCOUNT:
      return {loading: true, list: [], lastUsedStart: -1};
    case INIT_TRANSACTIONS:
      return {loading: false, list: payload!};
    case ADD_TRANSACTIONS:
      return {
        ...state,
        list: ArrayUtils.mergeWithoutDuplicate(state.list, payload![0], 'key'),
        lastUsedStart: payload![1],
      };
    default:
      return state;
  }
};
