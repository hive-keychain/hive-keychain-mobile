import preferencesReducer from '../preferences';
import {ADD_PREFERENCE, REMOVE_PREFERENCE} from 'actions/types';
import {UserPreference} from '../preferences.types';

describe('preferences reducer', () => {
  const initialState: UserPreference[] = [];

  it('should return initial state', () => {
    expect(preferencesReducer(undefined, {type: 'UNKNOWN'})).toEqual([]);
  });

  it('should handle ADD_PREFERENCE for new user', () => {
    const action = {
      type: ADD_PREFERENCE,
      payload: {
        username: 'testuser',
        domain: 'example.com',
        request: 'transfer',
      },
    };
    const result = preferencesReducer(initialState, action);
    expect(result).toEqual([
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer'],
          },
        ],
      },
    ]);
  });

  it('should handle ADD_PREFERENCE for existing user and domain', () => {
    const state: UserPreference[] = [
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer'],
          },
        ],
      },
    ];
    const action = {
      type: ADD_PREFERENCE,
      payload: {
        username: 'testuser',
        domain: 'example.com',
        request: 'delegate',
      },
    };
    const result = preferencesReducer(state, action);
    expect(result[0].domains[0].whitelisted_requests).toContain('transfer');
    expect(result[0].domains[0].whitelisted_requests).toContain('delegate');
  });

  it('should handle ADD_PREFERENCE for existing user but new domain', () => {
    const state: UserPreference[] = [
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer'],
          },
        ],
      },
    ];
    const action = {
      type: ADD_PREFERENCE,
      payload: {
        username: 'testuser',
        domain: 'other.com',
        request: 'transfer',
      },
    };
    const result = preferencesReducer(state, action);
    expect(result[0].domains).toHaveLength(2);
    expect(result[0].domains[1].domain).toBe('other.com');
  });

  it('should not add duplicate request', () => {
    const state: UserPreference[] = [
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer'],
          },
        ],
      },
    ];
    const action = {
      type: ADD_PREFERENCE,
      payload: {
        username: 'testuser',
        domain: 'example.com',
        request: 'transfer',
      },
    };
    const result = preferencesReducer(state, action);
    expect(result[0].domains[0].whitelisted_requests).toHaveLength(1);
  });

  it('should handle REMOVE_PREFERENCE', () => {
    const state: UserPreference[] = [
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer', 'delegate'],
          },
        ],
      },
    ];
    const action = {
      type: REMOVE_PREFERENCE,
      payload: {
        username: 'testuser',
        domain: 'example.com',
        request: 'transfer',
      },
    };
    const result = preferencesReducer(state, action);
    expect(result[0].domains[0].whitelisted_requests).not.toContain('transfer');
    expect(result[0].domains[0].whitelisted_requests).toContain('delegate');
  });

  it('should remove domain when last request is removed', () => {
    const state: UserPreference[] = [
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer'],
          },
        ],
      },
    ];
    const action = {
      type: REMOVE_PREFERENCE,
      payload: {
        username: 'testuser',
        domain: 'example.com',
        request: 'transfer',
      },
    };
    const result = preferencesReducer(state, action);
    expect(result).toEqual([]);
  });

  it('should return state unchanged for unknown action', () => {
    const state: UserPreference[] = [
      {
        username: 'testuser',
        domains: [
          {
            domain: 'example.com',
            whitelisted_requests: ['transfer'],
          },
        ],
      },
    ];
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = preferencesReducer(state, action);
    expect(result).toEqual(state);
  });
});


















