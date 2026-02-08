import {updateTokensFilter, clearTokensFilters} from '../tokensFilters';
import {UPDATE_TOKENS_FILTER, CLEAR_TOKENS_FILTERS} from '../types';
import {TokenHistoryFilter} from 'src/interfaces/tokensHistory.interface';
import {DEFAULT_FILTER_TOKENS} from 'reducers/tokensFilters';

describe('tokensFilters actions', () => {
  describe('updateTokensFilter', () => {
    it('should create action to update tokens filter', () => {
      const filter: TokenHistoryFilter = {
        ...DEFAULT_FILTER_TOKENS,
        filterValue: 'test',
        inSelected: true,
      };
      const action = updateTokensFilter(filter);
      expect(action.type).toBe(UPDATE_TOKENS_FILTER);
      expect(action.payload).toEqual(filter);
    });
  });

  describe('clearTokensFilters', () => {
    it('should create action to clear tokens filters', () => {
      const action = clearTokensFilters();
      expect(action.type).toBe(CLEAR_TOKENS_FILTERS);
    });
  });
});
