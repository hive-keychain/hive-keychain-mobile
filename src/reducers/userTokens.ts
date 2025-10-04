import {ActionPayload, TokenBalance, UserTokens} from 'actions/interfaces';
import {
  CLEAR_USER_TOKENS,
  LOAD_USER_TOKENS,
  STOP_USER_TOKENS_LOADING,
} from 'actions/types';

export default (
  state: UserTokens = {loading: false, list: []},
  {type, payload}: ActionPayload<TokenBalance[]>,
) => {
  switch (type) {
    case CLEAR_USER_TOKENS:
      return {loading: true, list: []};
    case LOAD_USER_TOKENS:
      return {loading: state.loading, list: payload!};
    case STOP_USER_TOKENS_LOADING:
      return {loading: false, list: state.list};
    default:
      return state;
  }
};
