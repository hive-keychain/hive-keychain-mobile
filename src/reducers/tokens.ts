import {actionPayload, token} from 'actions/interfaces';
import {LOAD_TOKENS} from 'actions/types';

export default (
  state: token[] = [],
  {type, payload}: actionPayload<token[]>,
) => {
  switch (type) {
    case LOAD_TOKENS:
      return payload!;
    default:
      return state;
  }
};
