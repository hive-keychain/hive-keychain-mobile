import authReducer from '../auth';
import {LOCK, SIGN_UP, UNLOCK} from 'actions/types';

describe('auth reducer', () => {
  const initialState = {mk: null};

  it('should return initial state', () => {
    expect(authReducer(undefined, {type: 'UNKNOWN'})).toEqual({mk: null});
  });

  it('should handle SIGN_UP', () => {
    const action = {
      type: SIGN_UP,
      payload: 'masterkey123',
    };
    const result = authReducer(initialState, action);
    expect(result).toEqual({mk: 'masterkey123'});
  });

  it('should handle UNLOCK', () => {
    const action = {
      type: UNLOCK,
      payload: 'masterkey456',
    };
    const result = authReducer(initialState, action);
    expect(result).toEqual({mk: 'masterkey456'});
  });

  it('should handle LOCK', () => {
    const state = {mk: 'masterkey123'};
    const action = {
      type: LOCK,
      payload: null,
    };
    const result = authReducer(state, action);
    expect(result).toEqual({mk: null, ignoreNextBiometrics: true});
  });

  it('should return state unchanged for unknown action', () => {
    const state = {mk: 'masterkey123'};
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: null,
    };
    const result = authReducer(state, action);
    expect(result).toEqual(state);
  });
});












