import {ActionPayload} from 'actions/interfaces';
import {CLEAR_WALLET_FILTERS, UPDATE_WALLET_FILTER} from 'actions/types';
import {persistReducer} from 'redux-persist';
import {WalletHistoryFilter} from 'src/interfaces/walletHistory.interface';
import {persistConfig} from './configs';

export const DEFAULT_WALLET_FILTER: WalletHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    transfer: false,
    claim_reward_balance: false,
    delegate_vesting_shares: false,
    savings: false,
    power_up_down: false,
    convert: false,
    account_create: false,
  },
};

const historyFiltersReducer = (
  state: WalletHistoryFilter = DEFAULT_WALLET_FILTER,
  {type, payload}: ActionPayload<WalletHistoryFilter>,
) => {
  switch (type) {
    case UPDATE_WALLET_FILTER:
      return {...state, ...payload};
    case CLEAR_WALLET_FILTERS:
      return DEFAULT_WALLET_FILTER;
    default:
      return state;
  }
};

export default persistReducer(
  persistConfig('walletFilterPersist'),
  historyFiltersReducer,
);
