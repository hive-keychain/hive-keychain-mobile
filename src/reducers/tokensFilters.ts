import {ActionPayload} from 'actions/interfaces';
import {CLEAR_TOKENS_FILTERS, UPDATE_TOKENS_FILTER} from 'actions/types';
import {persistReducer} from 'redux-persist';
import {TokenHistoryFilter} from 'src/types/tokens.history.types';
import {persistConfig} from './configs';

export enum HiveEngineFilterTypes {
  transfer = 'transfer',
  rewards = 'rewards',
  miningLottery = 'miningLottery',
  stake = 'stake',
  unstake = 'unstake',
  delegations = 'delegations',
}
export const DEFAULT_FILTER_TOKENS: TokenHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    transfer: false,
    rewards: false,
    miningLottery: false,
    stake: false,
    unstake: false,
    delegations: false,
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
