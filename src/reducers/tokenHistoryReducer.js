import {LOAD_TOKEN_HISTORY} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case LOAD_TOKEN_HISTORY:
      return payload;
    default:
      return state;
  }
};
