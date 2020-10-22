import {
  ACTIVE_ACCOUNT,
  ACTIVE_ACCOUNT_RC,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
} from 'actions/types';

const activeAccountReducer = (
  state = {account: {}, keys: {}, rc: {}},
  {type, payload},
) => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {...state, ...payload};
    case ACTIVE_ACCOUNT_RC:
      return {...state, rc: payload};
    case FORGET_ACCOUNT:
    case FORGET_ACCOUNTS:
      return {account: {}, keys: {}, rc: {}};
    default:
      return state;
  }
};

export default activeAccountReducer;
