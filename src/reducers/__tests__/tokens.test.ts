import tokensReducer from '../tokens';
import {LOAD_TOKENS} from 'actions/types';
import {Token} from 'src/interfaces/tokens.interface';

describe('tokens reducer', () => {
  const initialState: Token[] = [];

  it('should return initial state', () => {
    expect(tokensReducer(undefined, {type: 'UNKNOWN'})).toEqual([]);
  });

  it('should handle LOAD_TOKENS', () => {
    const tokens: Token[] = [
      {symbol: 'HIVE', name: 'Hive', precision: 3} as Token,
      {symbol: 'HBD', name: 'Hive Dollar', precision: 3} as Token,
    ];
    const action = {
      type: LOAD_TOKENS,
      payload: tokens,
    };
    const result = tokensReducer(initialState, action);
    expect(result).toEqual(tokens);
  });

  it('should replace existing tokens on LOAD_TOKENS', () => {
    const oldTokens: Token[] = [
      {symbol: 'OLD', name: 'Old Token'} as Token,
    ];
    const newTokens: Token[] = [
      {symbol: 'NEW', name: 'New Token'} as Token,
    ];
    const state = tokensReducer(initialState, {
      type: LOAD_TOKENS,
      payload: oldTokens,
    });
    const result = tokensReducer(state, {
      type: LOAD_TOKENS,
      payload: newTokens,
    });
    expect(result).toEqual(newTokens);
    expect(result).not.toContainEqual(oldTokens[0]);
  });

  it('should return state unchanged for unknown action', () => {
    const state: Token[] = [
      {symbol: 'TEST', name: 'Test Token'} as Token,
    ];
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: [],
    };
    const result = tokensReducer(state, action);
    expect(result).toEqual(state);
  });
});










