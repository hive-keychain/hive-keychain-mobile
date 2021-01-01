import {LOAD_USER_TOKENS, CLEAR_USER_TOKENS} from 'actions/types';

export default (state = {loading: false, list: []}, {type, payload}) => {
  switch (type) {
    case CLEAR_USER_TOKENS:
      return {loading: true, list: []};
    case LOAD_USER_TOKENS:
      return {loading: false, list: payload};
    default:
      return state;
  }
};
