import transactionsReducer from '../transactions';
import {
  ACTIVE_ACCOUNT,
  ADD_TRANSACTIONS,
  CLEAR_USER_TRANSACTIONS,
  INIT_TRANSACTIONS,
} from 'actions/types';
import {Transaction} from 'src/interfaces/transaction.interface';

describe('transactions reducer', () => {
  const initialState = {loading: false, list: [], lastUsedStart: -1};

  it('should return initial state', () => {
    expect(transactionsReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle CLEAR_USER_TRANSACTIONS', () => {
    const state = {
      loading: true,
      list: [{key: 'tx1'} as Transaction],
      lastUsedStart: 100,
    };
    const action = {
      type: CLEAR_USER_TRANSACTIONS,
      payload: undefined,
    };
    const result = transactionsReducer(state, action);
    expect(result).toEqual(initialState);
  });

  it('should handle ACTIVE_ACCOUNT', () => {
    const action = {
      type: ACTIVE_ACCOUNT,
      payload: {},
    };
    const result = transactionsReducer(initialState, action);
    expect(result.loading).toBe(true);
    expect(result.list).toEqual([]);
    expect(result.lastUsedStart).toBe(-1);
  });

  it('should handle INIT_TRANSACTIONS', () => {
    const transactions: Transaction[] = [
      {key: 'tx1', id: '1'} as Transaction,
      {key: 'tx2', id: '2'} as Transaction,
    ];
    const action = {
      type: INIT_TRANSACTIONS,
      payload: [transactions, 200],
    };
    const result = transactionsReducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.list).toEqual(transactions);
    expect(result.lastUsedStart).toBe(200);
  });

  it('should handle ADD_TRANSACTIONS', () => {
    const state = {
      loading: false,
      list: [{key: 'tx1', id: '1'} as Transaction],
      lastUsedStart: 100,
    };
    const newTransactions: Transaction[] = [
      {key: 'tx2', id: '2'} as Transaction,
      {key: 'tx3', id: '3'} as Transaction,
    ];
    const action = {
      type: ADD_TRANSACTIONS,
      payload: [newTransactions, 300],
    };
    const result = transactionsReducer(state, action);
    expect(result.list).toHaveLength(3);
    expect(result.lastUsedStart).toBe(300);
  });

  it('should merge transactions without duplicates on ADD_TRANSACTIONS', () => {
    const state = {
      loading: false,
      list: [{key: 'tx1', id: '1'} as Transaction],
      lastUsedStart: 100,
    };
    const newTransactions: Transaction[] = [
      {key: 'tx1', id: '1'} as Transaction, // duplicate
      {key: 'tx2', id: '2'} as Transaction,
    ];
    const action = {
      type: ADD_TRANSACTIONS,
      payload: [newTransactions, 200],
    };
    const result = transactionsReducer(state, action);
    expect(result.list).toHaveLength(2); // Should not duplicate tx1
  });

  it('should return state unchanged for unknown action', () => {
    const state = {
      loading: false,
      list: [{key: 'tx1'} as Transaction],
      lastUsedStart: 100,
    };
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: undefined,
    };
    const result = transactionsReducer(state, action);
    expect(result).toEqual(state);
  });
});















