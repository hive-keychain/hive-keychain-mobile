import {ActionPayload} from 'actions/interfaces';
import {CLEAR_WALLET_FILTERS, UPDATE_WALLET_FILTER} from 'actions/types';
import {persistReducer} from 'redux-persist';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {persistConfig} from './configs';

const DEFAULT_FILTER: WalletHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    transfer: false,
    claim_reward_balance: false,
    delegate_vesting_shares: false,
    claim_account: false,
    savings: false,
    power_up_down: false,
    convert: false,
  },
};

const walletFilterReducer = (
  state: WalletHistoryFilter = DEFAULT_FILTER,
  {type, payload}: ActionPayload<WalletHistoryFilter>,
) => {
  switch (type) {
    case UPDATE_WALLET_FILTER:
      return {...state, ...payload};
    case CLEAR_WALLET_FILTERS:
      console.log('clearing as: ', {DEFAULT_FILTER}); //TODO to remove
      return DEFAULT_FILTER;
    default:
      return state;
  }
};

export default persistReducer(
  persistConfig('walletFilterPersist'),
  walletFilterReducer,
);
