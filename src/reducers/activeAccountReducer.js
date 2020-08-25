import {ACTIVE_ACCOUNT} from 'actions/types';

const activeAccountReducer = (
  state = {account: {}, keys: {}},
  {type, payload},
) => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return payload;
    default:
      return state;
  }
};

export default activeAccountReducer;
