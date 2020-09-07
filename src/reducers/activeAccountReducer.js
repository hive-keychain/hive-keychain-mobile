import {ACTIVE_ACCOUNT, ACTIVE_ACCOUNT_RC} from 'actions/types';

const activeAccountReducer = (
  state = {account: {}, keys: {}, rc: {}},
  {type, payload},
) => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {...state, ...payload};
    case ACTIVE_ACCOUNT_RC:
      return {...state, rc: payload};
    default:
      return state;
  }
};

export default activeAccountReducer;
