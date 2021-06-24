import {ActionPayload, LastAccount} from 'actions/interfaces';
import {persistReducer} from 'redux-persist';
import {
  ACTIVE_ACCOUNT,
  ADD_ACCOUNT,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
} from '../actions/types';
import {persistConfig} from './configs';

const lastAccountReducer = (
  state = {has: false},
  {type, payload}: ActionPayload<LastAccount>,
): LastAccount => {
  switch (type) {
    case ADD_ACCOUNT:
      return {...state, has: true};
    case FORGET_ACCOUNTS:
      return {has: false};
    case FORGET_ACCOUNT:
      return {has: state.has};
    case ACTIVE_ACCOUNT:
      if (payload!.name) {
        return {has: true, name: payload!.name};
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
