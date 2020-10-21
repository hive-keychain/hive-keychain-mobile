import {persistReducer} from 'redux-persist';
import {ADD_ACCOUNT, FORGET_ACCOUNTS, ACTIVE_ACCOUNT} from '../actions/types';
import {persistConfig} from './configs';

const lastAccountReducer = (state = {has: true}, {type, payload}) => {
  switch (type) {
    case ADD_ACCOUNT:
      return {...state, has: true};
    case FORGET_ACCOUNTS:
      return {...state, has: false};
    case ACTIVE_ACCOUNT:
      if (payload.name) {
        return {has: true, name: payload.name};
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default persistReducer(
  persistConfig('hasAccountsPersist'),
  lastAccountReducer,
);
