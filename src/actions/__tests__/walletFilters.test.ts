import {updateWalletFilter, clearWalletFilters} from '../walletFilters';
import {UPDATE_WALLET_FILTER, CLEAR_WALLET_FILTERS} from '../types';
import {WalletHistoryFilter} from 'src/interfaces/walletHistory.interface';
import {DEFAULT_WALLET_FILTER} from 'reducers/historyFilters';

describe('walletFilters actions', () => {
  describe('updateWalletFilter', () => {
    it('should create action to update wallet filter', () => {
      const filter: WalletHistoryFilter = {
        ...DEFAULT_WALLET_FILTER,
        filterValue: 'test',
        inSelected: true,
      };
      const action = updateWalletFilter(filter);
      expect(action.type).toBe(UPDATE_WALLET_FILTER);
      expect(action.payload).toEqual(filter);
    });
  });

  describe('clearWalletFilters', () => {
    it('should create action to clear wallet filters', () => {
      const action = clearWalletFilters();
      expect(action.type).toBe(CLEAR_WALLET_FILTERS);
    });
  });
});
