import {LOAD_TOKENS_MARKET} from 'actions/types';
import {actionPayload, tokenMarket} from 'actions/interfaces';
export default (
  state: [tokenMarket?] = [],
  {type, payload}: actionPayload<[tokenMarket]>,
) => {
  switch (type) {
    case LOAD_TOKENS_MARKET:
      return payload;
    default:
      return state;
  }
};
