jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
  __esModule: true,
}));

jest.mock('redux-persist', () => ({
  persistReducer: jest.fn((config, reducer) => {
    // Ensure we return a function (reducer)
    if (typeof reducer === 'function') {
      return reducer;
    }
    // If reducer is not a function, return a default reducer function
    return (state = {}, action: any) => state;
  }),
  persistStore: jest.fn(() => ({
    purge: jest.fn(),
    pause: jest.fn(),
    persist: jest.fn(),
    flush: jest.fn(),
  })),
}));

jest.mock('redux-persist/es/createTransform', () => {
  return jest.fn((inbound, outbound, config) => ({
    inbound,
    outbound,
    config,
  }));
});

jest.mock('redux-thunk', () => ({
  thunk: (store: any) => (next: any) => (action: any) => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState);
    }
    return next(action);
  },
}));

jest.mock('reducers/index', () => {
  const mockReducer = (state = {}, action: any) => state;
  return {
    default: mockReducer,
  };
});

import {AppDispatch, getSafeState, persistor, RootState, store} from '../index';

describe('store/index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should have getState method', () => {
      expect(store.getState).toBeDefined();
      expect(typeof store.getState).toBe('function');
    });

    it('should have dispatch method', () => {
      expect(store.dispatch).toBeDefined();
      expect(typeof store.dispatch).toBe('function');
    });

    it('should have subscribe method', () => {
      expect(store.subscribe).toBeDefined();
      expect(typeof store.subscribe).toBe('function');
    });

    it('should have replaceReducer method', () => {
      expect(store.replaceReducer).toBeDefined();
      expect(typeof store.replaceReducer).toBe('function');
    });
  });

  describe('persistor', () => {
    it('should be defined', () => {
      expect(persistor).toBeDefined();
    });

    it('should have purge method', () => {
      expect(persistor.purge).toBeDefined();
      expect(typeof persistor.purge).toBe('function');
    });

    it('should have pause method', () => {
      expect(persistor.pause).toBeDefined();
      expect(typeof persistor.pause).toBe('function');
    });

    it('should have persist method', () => {
      expect(persistor.persist).toBeDefined();
      expect(typeof persistor.persist).toBe('function');
    });

    it('should have flush method', () => {
      expect(persistor.flush).toBeDefined();
      expect(typeof persistor.flush).toBe('function');
    });
  });

  describe('getSafeState', () => {
    it('should return state without sensitive data', () => {
      const mockState = {
        accounts: [
          {name: 'user1', keys: {active: 'key1', posting: 'key2'}},
          {name: 'user2', keys: {active: 'key3'}},
        ],
        activeAccount: {
          name: 'user1',
          keys: {active: 'key1'},
          account: {name: 'user1', balance: '100 HIVE'},
        },
        auth: {mk: 'masterkey'},
        conversions: [{id: 1}],
        phishingAccounts: ['phishing1'],
        lastAccount: 'user1',
        settings: {rpc: {uri: 'https://rpc.com'}},
        _persist: {version: 1},
        preferences: {_persist: {version: 1}},
      } as any;

      // Mock store.getState to return our test state
      jest.spyOn(store, 'getState').mockReturnValue(mockState);

      const safeState = getSafeState();

      // Check that keys are removed from accounts
      expect(safeState.accounts[0].keys).toBeUndefined();
      expect(safeState.accounts[1].keys).toBeUndefined();

      // Check that keys are removed from activeAccount
      expect(safeState.activeAccount.keys).toBeUndefined();

      // Check that sensitive data is removed
      expect(safeState.auth).toBeUndefined();
      expect(safeState.conversions).toBeUndefined();
      expect(safeState.phishingAccounts).toBeUndefined();
      expect(safeState.activeAccount.account).toBeUndefined();

      // Check that _persist is removed from root
      expect(safeState._persist).toBeUndefined();

      // Check that _persist is removed from nested objects
      expect(safeState.preferences._persist).toBeUndefined();

      // Check that other data is preserved
      expect(safeState.lastAccount).toBe('user1');
      expect(safeState.settings).toBeDefined();
    });

    it('should handle empty state', () => {
      const mockState = {} as any;
      jest.spyOn(store, 'getState').mockReturnValue(mockState);

      const safeState = getSafeState();
      expect(safeState).toEqual({});
    });

    it('should handle state without accounts', () => {
      const mockState = {
        settings: {rpc: {uri: 'https://rpc.com'}},
      } as any;
      jest.spyOn(store, 'getState').mockReturnValue(mockState);

      const safeState = getSafeState();
      expect(safeState.settings).toBeDefined();
    });

    it('should handle state without activeAccount', () => {
      const mockState = {
        accounts: [{name: 'user1'}],
        settings: {rpc: {uri: 'https://rpc.com'}},
      } as any;
      jest.spyOn(store, 'getState').mockReturnValue(mockState);

      const safeState = getSafeState();
      expect(safeState.accounts).toBeDefined();
    });
  });

  describe('Type exports', () => {
    it('should export RootState type', () => {
      // Type check - if this compiles, the type is exported correctly
      const state: RootState = store.getState();
      expect(state).toBeDefined();
    });

    it('should export AppDispatch type', () => {
      // Type check - if this compiles, the type is exported correctly
      const dispatch: AppDispatch = store.dispatch;
      expect(dispatch).toBeDefined();
    });
  });
});
