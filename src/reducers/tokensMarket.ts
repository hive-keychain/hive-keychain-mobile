import {ActionPayload, TokenMarket} from 'actions/interfaces';
import {LOAD_TOKENS_MARKET} from 'actions/types';

export default (
  state: TokenMarket[] = [],
  {type, payload}: ActionPayload<TokenMarket[]>,
) => {
  switch (type) {
    case LOAD_TOKENS_MARKET:
      return payload!;
    default:
      return state;
  }
};
