import lastAccountReducer from '../lastAccount';
import {
  ADD_ACCOUNT,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
  ACTIVE_ACCOUNT,
} from 'actions/types';

// Mock redux-persist
jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn((config, reducer) => reducer),
  };
});

describe('lastAccount reducer', () => {
  const initialState = {has: false};

  it('should return initial state', () => {
    expect(lastAccountReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle ADD_ACCOUNT', () => {
    const action = {
      type: ADD_ACCOUNT,
      payload: {},
    };
    const result = lastAccountReducer(initialState, action);
    expect(result.has).toBe(true);
  });

  it('should handle FORGET_ACCOUNTS', () => {
    const state = {has: true, name: 'testuser'};
    const action = {
      type: FORGET_ACCOUNTS,
      payload: {},
    };
    const result = lastAccountReducer(state, action);
    expect(result).toEqual({has: false});
  });

  it('should handle FORGET_ACCOUNT', () => {
    const state = {has: true, name: 'testuser'};
    const action = {
      type: FORGET_ACCOUNT,
      payload: {},
    };
    const result = lastAccountReducer(state, action);
    expect(result.has).toBe(true); // Should preserve has state
  });

  it('should handle ACTIVE_ACCOUNT with name', () => {
    const action = {
      type: ACTIVE_ACCOUNT,
      payload: {name: 'testuser'},
    };
    const result = lastAccountReducer(initialState, action);
    expect(result.has).toBe(true);
    expect(result.name).toBe('testuser');
  });

  it('should not update state on ACTIVE_ACCOUNT without name', () => {
    const state = {has: true, name: 'testuser'};
    const action = {
      type: ACTIVE_ACCOUNT,
      payload: {},
    };
    const result = lastAccountReducer(state, action);
    expect(result).toEqual(state);
  });

  it('should return state unchanged for unknown action', () => {
    const state = {has: true, name: 'testuser'};
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = lastAccountReducer(state, action);
    expect(result).toEqual(state);
  });
});


















