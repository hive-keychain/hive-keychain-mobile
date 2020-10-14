import {LOAD_TOKENS_MARKET} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case LOAD_TOKENS_MARKET:
      return payload;
    default:
      return state;
  }
};
