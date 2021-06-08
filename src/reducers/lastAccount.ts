import {persistReducer} from 'redux-persist';
import {
  ADD_ACCOUNT,
  FORGET_ACCOUNTS,
  FORGET_ACCOUNT,
  ACTIVE_ACCOUNT,
} from '../actions/types';
import {actionPayload, lastAccount} from 'actions/interfaces';
import {persistConfig} from './configs';

const lastAccountReducer = (
  state = {has: false},
  {type, payload}: actionPayload<lastAccount>,
): lastAccount => {
  switch (type) {
    case ADD_ACCOUNT:
      return {...state, has: true};
    case FORGET_ACCOUNTS:
      return {has: false};
    case FORGET_ACCOUNT:
      return {has: state.has};
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
