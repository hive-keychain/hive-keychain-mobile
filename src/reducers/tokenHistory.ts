import {ActionPayload, TokenTransaction} from 'actions/interfaces';
import {LOAD_TOKEN_HISTORY} from 'actions/types';

export default (
  state: TokenTransaction[] = [],
  {type, payload}: ActionPayload<TokenTransaction[]>,
) => {
  switch (type) {
    case LOAD_TOKEN_HISTORY:
      return payload!;
    default:
      return state;
  }
};
