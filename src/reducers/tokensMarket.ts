import {ActionPayload} from 'actions/interfaces';
import {LOAD_TOKENS_MARKET} from 'actions/types';
import {TokenMarket} from 'src/interfaces/tokens.interface';

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
