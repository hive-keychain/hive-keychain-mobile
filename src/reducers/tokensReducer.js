import {LOAD_TOKENS} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case LOAD_TOKENS:
      return payload;
    default:
      return state;
  }
};
