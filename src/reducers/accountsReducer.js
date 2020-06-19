import {ADD_ACCOUNT} from '../actions/types';

export default (state = [], {type, payload}) => {
  console.log('a', state, type, payload);
  switch (type) {
    case ADD_ACCOUNT:
      return [...state, payload];
    default:
      return state;
  }
};
