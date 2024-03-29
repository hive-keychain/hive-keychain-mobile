import {ActionPayload} from 'actions/interfaces';
import {CLEAR_TOKEN_HISTORY, LOAD_TOKEN_HISTORY} from 'actions/types';
import {TokenTransaction} from 'src/interfaces/tokens.interface';

export default (
  state: TokenTransaction[] = [],
  {type, payload}: ActionPayload<TokenTransaction[]>,
) => {
  switch (type) {
    case LOAD_TOKEN_HISTORY:
      return payload!;
    case CLEAR_TOKEN_HISTORY:
      return [];
    default:
      return state;
  }
};
