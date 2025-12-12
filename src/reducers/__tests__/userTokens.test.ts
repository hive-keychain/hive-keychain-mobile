import reducer from '../userTokens';
import {
  CLEAR_USER_TOKENS,
  LOAD_USER_TOKENS,
  STOP_USER_TOKENS_LOADING,
} from 'actions/types';
import {TokenBalance} from 'src/interfaces/tokens.interface';

describe('userTokens reducer', () => {
  const initialState = {loading: false, list: []};

  it('should return initial state', () => {
    expect(reducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('should handle CLEAR_USER_TOKENS', () => {
    const state = {loading: false, list: [{symbol: 'BEE', balance: '100'}]};
    const action = {type: CLEAR_USER_TOKENS};
    const result = reducer(state, action);
    expect(result.loading).toBe(true);
    expect(result.list).toEqual([]);
  });

  it('should handle LOAD_USER_TOKENS', () => {
    const tokens: TokenBalance[] = [
      {symbol: 'BEE', balance: '100', stake: '50', pendingUnstake: '0'},
      {symbol: 'SWAP.HIVE', balance: '200', stake: '0', pendingUnstake: '0'},
    ];
    const state = {loading: true, list: []};
    const action = {type: LOAD_USER_TOKENS, payload: tokens};
    const result = reducer(state, action);
    expect(result.loading).toBe(true);
    expect(result.list).toEqual(tokens);
  });

  it('should preserve loading state when loading tokens', () => {
    const tokens: TokenBalance[] = [{symbol: 'BEE', balance: '100'}];
    const state = {loading: true, list: []};
    const action = {type: LOAD_USER_TOKENS, payload: tokens};
    const result = reducer(state, action);
    expect(result.loading).toBe(true);
  });

  it('should handle STOP_USER_TOKENS_LOADING', () => {
    const tokens: TokenBalance[] = [{symbol: 'BEE', balance: '100'}];
    const state = {loading: true, list: tokens};
    const action = {type: STOP_USER_TOKENS_LOADING};
    const result = reducer(state, action);
    expect(result.loading).toBe(false);
    expect(result.list).toEqual(tokens);
  });

  it('should preserve list when stopping loading', () => {
    const tokens: TokenBalance[] = [
      {symbol: 'BEE', balance: '100'},
      {symbol: 'SWAP.HIVE', balance: '200'},
    ];
    const state = {loading: true, list: tokens};
    const action = {type: STOP_USER_TOKENS_LOADING};
    const result = reducer(state, action);
    expect(result.list).toEqual(tokens);
  });

  it('should handle empty token list', () => {
    const state = {loading: true, list: []};
    const action = {type: LOAD_USER_TOKENS, payload: []};
    const result = reducer(state, action);
    expect(result.list).toEqual([]);
  });

  it('should handle unknown action', () => {
    const state = {loading: false, list: [{symbol: 'BEE', balance: '100'}]};
    const action = {type: 'UNKNOWN_ACTION'};
    const result = reducer(state, action);
    expect(result).toEqual(state);
  });
});









