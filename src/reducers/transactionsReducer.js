import {
  INIT_TRANSACTIONS,
  ADD_TRANSACTIONS,
  ACTIVE_ACCOUNT,
} from '../actions/types';

export default (state = {loading: false, list: []}, {type, payload}) => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {loading: true, list: []};
    case INIT_TRANSACTIONS:
      return {loading: false, list: payload};
    case ADD_TRANSACTIONS:
      //check if the transaction is received for the same user (username is part of the unique key)
      console.log(
        state.list[0].key.split('!')[0],
        payload[0].key.split('!')[0],
      );
      if (
        !state.list[0] ||
        state.list[0].key.split('!')[0] === payload[0].key.split('!')[0]
      ) {
        return {...state, list: [...state.list, ...payload]};
      } else {
        return state;
      }
    default:
      return state;
  }
};
