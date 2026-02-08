import {ActionPayload} from 'actions/interfaces';
import {CLEAR_TOKEN_HISTORY, LOAD_TOKEN_HISTORY} from 'actions/types';
import {TokenTransaction} from 'src/interfaces/tokens.interface';
import reducer from '../tokenHistory';

describe('tokenHistory reducer', () => {
  const mockTransaction: TokenTransaction = {
    key: 'test-key',
    amount: '100',
    from: 'user1',
    memo: 'test memo',
    timestamp: '2023-01-01T00:00:00',
    to: 'user2',
    type: 'transfer',
  };

  describe('initial state', () => {
    it('should return empty array when state is undefined', () => {
      const result = reducer(
        undefined,
        {} as ActionPayload<TokenTransaction[]>,
      );
      expect(result).toEqual([]);
    });

    it('should return state for unknown action type', () => {
      const state: TokenTransaction[] = [mockTransaction];
      const action = {type: 'UNKNOWN_ACTION' as any} as ActionPayload<
        TokenTransaction[]
      >;
      const result = reducer(state, action);
      expect(result).toEqual(state);
    });
  });

  describe('LOAD_TOKEN_HISTORY action', () => {
    it('should load token history', () => {
      const transactions: TokenTransaction[] = [mockTransaction];
      const action: ActionPayload<TokenTransaction[]> = {
        type: LOAD_TOKEN_HISTORY,
        payload: transactions,
      };

      const result = reducer([], action);

      expect(result).toEqual(transactions);
      expect(result).toHaveLength(1);
    });

    it('should replace existing history', () => {
      const oldTransactions: TokenTransaction[] = [mockTransaction];
      const newTransactions: TokenTransaction[] = [
        {...mockTransaction, key: 'new-key', amount: '200'},
      ];

      const action: ActionPayload<TokenTransaction[]> = {
        type: LOAD_TOKEN_HISTORY,
        payload: newTransactions,
      };

      const result = reducer(oldTransactions, action);

      expect(result).toEqual(newTransactions);
      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('new-key');
    });

    it('should handle empty array', () => {
      const action: ActionPayload<TokenTransaction[]> = {
        type: LOAD_TOKEN_HISTORY,
        payload: [],
      };

      const result = reducer([mockTransaction], action);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('CLEAR_TOKEN_HISTORY action', () => {
    it('should clear token history', () => {
      const state: TokenTransaction[] = [mockTransaction];
      const action: ActionPayload<TokenTransaction[]> = {
        type: CLEAR_TOKEN_HISTORY,
      };

      const result = reducer(state, action);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should clear empty history', () => {
      const action: ActionPayload<TokenTransaction[]> = {
        type: CLEAR_TOKEN_HISTORY,
      };

      const result = reducer([], action);

      expect(result).toEqual([]);
    });
  });
});
