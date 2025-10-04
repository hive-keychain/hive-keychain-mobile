import {WalletHistoryFilter} from 'src/interfaces/walletHistory.interface';
import {ActionPayload} from './interfaces';
import {CLEAR_WALLET_FILTERS, UPDATE_WALLET_FILTER} from './types';

export const updateWalletFilter = (walletFilters: WalletHistoryFilter) => {
  const action: ActionPayload<WalletHistoryFilter> = {
    type: UPDATE_WALLET_FILTER,
    payload: walletFilters,
  };
  return action;
};

export const clearWalletFilters = () => {
  const action: ActionPayload<WalletHistoryFilter> = {
    type: CLEAR_WALLET_FILTERS,
  };
  return action;
};
