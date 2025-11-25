import accountsReducer from '../accounts';
import {
  ADD_ACCOUNT,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
  INIT_ACCOUNTS,
  LOCK,
  UPDATE_ACCOUNTS,
} from 'actions/types';
import {Account} from 'actions/interfaces';

describe('accounts reducer', () => {
  const mockAccount: Account = {
    name: 'testuser',
    keys: {},
  } as Account;

  const initialState: Account[] = [];

  it('should return initial state', () => {
    expect(accountsReducer(undefined, {type: 'UNKNOWN'})).toEqual([]);
  });

  it('should handle ADD_ACCOUNT', () => {
    const action = {
      type: ADD_ACCOUNT,
      payload: {account: mockAccount},
    };
    const result = accountsReducer(initialState, action);
    expect(result).toEqual([mockAccount]);
  });

  it('should handle INIT_ACCOUNTS', () => {
    const accounts = [mockAccount, {...mockAccount, name: 'user2'}];
    const action = {
      type: INIT_ACCOUNTS,
      payload: {accounts},
    };
    const result = accountsReducer(initialState, action);
    expect(result).toEqual(accounts);
  });

  it('should handle UPDATE_ACCOUNTS', () => {
    const accounts = [mockAccount];
    const action = {
      type: UPDATE_ACCOUNTS,
      payload: {accounts},
    };
    const result = accountsReducer(initialState, action);
    expect(result).toEqual(accounts);
  });

  it('should handle FORGET_ACCOUNT', () => {
    const state = [mockAccount, {...mockAccount, name: 'user2'}];
    const action = {
      type: FORGET_ACCOUNT,
      payload: {name: 'testuser'},
    };
    const result = accountsReducer(state, action);
    expect(result).toEqual([{...mockAccount, name: 'user2'}]);
  });

  it('should handle FORGET_ACCOUNTS', () => {
    const state = [mockAccount, {...mockAccount, name: 'user2'}];
    const action = {
      type: FORGET_ACCOUNTS,
      payload: {},
    };
    const result = accountsReducer(state, action);
    expect(result).toEqual([]);
  });

  it('should handle LOCK', () => {
    const state = [mockAccount];
    const action = {
      type: LOCK,
      payload: {},
    };
    const result = accountsReducer(state, action);
    expect(result).toEqual([]);
  });

  it('should return state unchanged for unknown action', () => {
    const state = [mockAccount];
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = accountsReducer(state, action);
    expect(result).toEqual(state);
  });
});








