import {TokenHistoryFilter} from 'src/interfaces/tokensHistory.interface';
import {ActionPayload} from './interfaces';
import {CLEAR_TOKENS_FILTERS, UPDATE_TOKENS_FILTER} from './types';

export const updateTokensFilter = (tokensFilters: TokenHistoryFilter) => {
  const action: ActionPayload<TokenHistoryFilter> = {
    type: UPDATE_TOKENS_FILTER,
    payload: tokensFilters,
  };
  return action;
};

export const clearTokensFilters = () => {
  const action: ActionPayload<TokenHistoryFilter> = {
    type: CLEAR_TOKENS_FILTERS,
  };
  return action;
};
