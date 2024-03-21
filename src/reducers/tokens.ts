import {ActionPayload} from 'actions/interfaces';
import {LOAD_TOKENS} from 'actions/types';
import {Token} from 'src/interfaces/tokens.interface';

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
