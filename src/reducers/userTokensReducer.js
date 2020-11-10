import {LOAD_USER_TOKENS, CLEAR_USER_TOKENS} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case CLEAR_USER_TOKENS:
      return [];
    case LOAD_USER_TOKENS:
      return payload;
    default:
      return state;
  }
};
