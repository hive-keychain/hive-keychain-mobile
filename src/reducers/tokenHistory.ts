import {actionPayload, tokenTransaction} from 'actions/interfaces';
import {LOAD_TOKEN_HISTORY} from 'actions/types';

export default (
  state: [tokenTransaction?] = [],
  {type, payload}: actionPayload<[tokenTransaction?]>,
) => {
  switch (type) {
    case LOAD_TOKEN_HISTORY:
      return payload;
    default:
      return state;
  }
};
