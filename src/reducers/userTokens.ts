import {ActionPayload, TokenBalance, UserTokens} from 'actions/interfaces';
import {CLEAR_USER_TOKENS, LOAD_USER_TOKENS} from 'actions/types';

export default (
  state: UserTokens = {loading: false, list: []},
  {type, payload}: ActionPayload<TokenBalance[]>,
) => {
  switch (type) {
    case CLEAR_USER_TOKENS:
      return {loading: true, list: []};
    case LOAD_USER_TOKENS:
      return {loading: false, list: payload!};
    default:
      return state;
  }
};
