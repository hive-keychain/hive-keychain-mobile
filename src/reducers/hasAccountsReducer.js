import {persistReducer} from 'redux-persist';
import {ADD_ACCOUNT, FORGET_ACCOUNTS} from '../actions/types';
import {persistConfig} from './configs';

const hasAccountsReducer = (state = {has: false}, {type}) => {
  console.log(type, state);
  switch (type) {
    case ADD_ACCOUNT:
      return {...state, has: true};
    case FORGET_ACCOUNTS:
      return {...state, has: false};
    default:
      return state;
  }
};

export default persistReducer(
  persistConfig('hasAccountsPersist'),
  hasAccountsReducer,
);
