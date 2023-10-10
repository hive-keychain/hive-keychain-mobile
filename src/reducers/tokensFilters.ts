import {ActionPayload} from 'actions/interfaces';
import {CLEAR_TOKENS_FILTERS, UPDATE_TOKENS_FILTER} from 'actions/types';
import {persistReducer} from 'redux-persist';
import {TokenHistoryFilter} from 'src/types/tokens.history.types';
import {persistConfig} from './configs';

export const DEFAULT_FILTER_TOKENS: TokenHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    comments_curationReward: false,
    comments_authorReward: false,
    mining_lottery: false,
    tokens_transfer: false,
    tokens_stake: false,
    tokens_unstakeStart: false,
    tokens_unstakeDone: false,
    tokens_delegate: false,
    tokens_undelegateStart: false,
    tokens_undelegateDone: false,
  },
};

const tokensFilterReducer = (
  state: TokenHistoryFilter = DEFAULT_FILTER_TOKENS,
  {type, payload}: ActionPayload<TokenHistoryFilter>,
) => {
  switch (type) {
    case UPDATE_TOKENS_FILTER:
      return {...state, ...payload};
    case CLEAR_TOKENS_FILTERS:
      return {...DEFAULT_FILTER_TOKENS};
    default:
      return state;
  }
};

export default persistReducer(
  persistConfig('tokensFilterPersist'),
  tokensFilterReducer,
);
