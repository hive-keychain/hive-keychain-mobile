import {ActionPayload, Token} from 'actions/interfaces';
import {LOAD_TOKENS} from 'actions/types';

export default (
  state: Token[] = [],
  {type, payload}: ActionPayload<Token[]>,
) => {
  switch (type) {
    case LOAD_TOKENS:
      return payload!;
    default:
      return state;
  }
};
