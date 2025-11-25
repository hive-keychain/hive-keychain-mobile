import {HAS_ActionsTypes} from 'actions/types';
import {KeychainRequestTypes} from 'src/interfaces/keychain.interface';
import reducer, {HAS_State} from '../hiveAuthenticationService';
import {HAS_Actions} from '../hiveAuthenticationService/types';

describe('hiveAuthenticationService reducer', () => {
  const initialState: HAS_State = {
    sessions: [],
    instances: [],
  };

  describe('initial state', () => {
    it('should return initial state when state is undefined', () => {
      const result = reducer(undefined, {} as HAS_Actions);
      expect(result).toEqual(initialState);
    });

    it('should return initial state for unknown action type', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'test',
            account: 'user1',
            host: 'host1',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [{host: 'host1', init: false}],
      };
      const action = {type: 'UNKNOWN_ACTION' as any} as HAS_Actions;
      const result = reducer(state, action);
      expect(result).toEqual(state);
    });
  });

  describe('REQUEST action', () => {
    it('should add new session and instance', () => {
      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REQUEST,
        payload: {
          account: 'user1',
          uuid: 'uuid1',
          host: 'https://example.com',
          auth_key: 'auth_key1',
        },
      };

      const result = reducer(initialState, action);

      expect(result.sessions).toHaveLength(1);
      expect(result.sessions[0]).toEqual({
        account: 'user1',
        uuid: 'uuid1',
        host: 'https://example.com',
        auth_key: 'auth_key1',
        init: false,
        whitelist: [],
      });
      expect(result.instances).toHaveLength(1);
      expect(result.instances[0]).toEqual({
        host: 'https://example.com',
        init: false,
      });
    });

    it('should remove trailing slash from host', () => {
      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REQUEST,
        payload: {
          account: 'user1',
          uuid: 'uuid1',
          host: 'https://example.com/',
          auth_key: 'auth_key1',
        },
      };

      const result = reducer(initialState, action);

      expect(result.instances[0].host).toBe('https://example.com');
      expect(result.sessions[0].host).toBe('https://example.com');
    });

    it('should not add duplicate instance', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [{host: 'https://example.com', init: false}],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REQUEST,
        payload: {
          account: 'user2',
          uuid: 'uuid2',
          host: 'https://example.com',
          auth_key: 'auth_key2',
        },
      };

      const result = reducer(state, action);

      expect(result.instances).toHaveLength(1);
      expect(result.sessions).toHaveLength(1);
    });

    it('should add multiple sessions for same host', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [{host: 'https://example.com', init: false}],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REQUEST,
        payload: {
          account: 'user2',
          uuid: 'uuid2',
          host: 'https://example.com',
          auth_key: 'auth_key2',
        },
      };

      const result = reducer(state, action);

      expect(result.sessions).toHaveLength(2);
      expect(result.instances).toHaveLength(1);
    });
  });

  describe('REQUEST_TREATED action', () => {
    it('should set init to true for matching host', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
          {
            uuid: 'uuid2',
            account: 'user2',
            host: 'https://other.com',
            auth_key: 'key2',
            init: false,
            whitelist: [],
          },
        ],
        instances: [
          {host: 'https://example.com', init: false},
          {host: 'https://other.com', init: false},
        ],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REQUEST_TREATED,
        payload: 'https://example.com',
      };

      const result = reducer(state, action);

      expect(
        result.instances.find((i) => i.host === 'https://example.com')?.init,
      ).toBe(true);
      expect(
        result.instances.find((i) => i.host === 'https://other.com')?.init,
      ).toBe(false);
      expect(
        result.sessions.find((s) => s.host === 'https://example.com')?.init,
      ).toBe(true);
      expect(
        result.sessions.find((s) => s.host === 'https://other.com')?.init,
      ).toBe(false);
    });

    it('should handle non-existent host gracefully', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REQUEST_TREATED,
        payload: 'https://nonexistent.com',
      };

      const result = reducer(state, action);

      expect(result.instances).toHaveLength(0);
      expect(result.sessions).toHaveLength(0);
    });
  });

  describe('ADD_TOKEN action', () => {
    it('should add token to existing session', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_TOKEN,
        payload: {
          uuid: 'uuid1',
          token: {
            app: 'test-app',
            token: 'token123',
            expiration: Date.now() + 100000,
          },
        },
      };

      const result = reducer(state, action);

      expect(result.sessions[0].token).toEqual({
        app: 'test-app',
        token: 'token123',
        expiration: expect.any(Number),
      });
    });

    it('should return state unchanged if session not found', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_TOKEN,
        payload: {
          uuid: 'nonexistent-uuid',
          token: {
            app: 'test-app',
            token: 'token123',
            expiration: Date.now() + 100000,
          },
        },
      };

      const result = reducer(state, action);

      expect(result).toEqual(state);
      expect(result.sessions[0].token).toBeUndefined();
    });
  });

  describe('ADD_SERVER_KEY action', () => {
    it('should add server key to instance', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [{host: 'https://example.com', init: false}],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_SERVER_KEY,
        payload: {
          host: 'https://example.com',
          server_key: 'server_key_123',
        },
      };

      const result = reducer(state, action);

      const instance = result.instances.find(
        (i) => i.host === 'https://example.com',
      );
      expect(instance?.server_key).toBe('server_key_123');
      expect(instance?.init).toBe(true);
    });

    it('should handle instance not found', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_SERVER_KEY,
        payload: {
          host: 'https://example.com',
          server_key: 'server_key_123',
        },
      };

      // This will throw an error because instance is undefined when trying to access instance.init
      expect(() => reducer(state, action)).toThrow();
    });
  });

  describe('CLEAR action', () => {
    it('should clear all sessions and instances', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
          {
            uuid: 'uuid2',
            account: 'user2',
            host: 'https://other.com',
            auth_key: 'key2',
            init: false,
            whitelist: [],
          },
        ],
        instances: [
          {host: 'https://example.com', init: true, server_key: 'key1'},
          {host: 'https://other.com', init: true},
        ],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.CLEAR,
      };

      const result = reducer(state, action);

      expect(result.sessions).toEqual([]);
      expect(result.instances).toEqual([]);
    });
  });

  describe('UPDATE_INSTANCE_CONNECTION_STATUS action', () => {
    it('should update connection status', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [
          {host: 'https://example.com', init: true, connected: false},
        ],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.UPDATE_INSTANCE_CONNECTION_STATUS,
        payload: {
          host: 'https://example.com',
          connected: true,
        },
      };

      const result = reducer(state, action);

      const instance = result.instances.find(
        (i) => i.host === 'https://example.com',
      );
      expect(instance?.connected).toBe(true);
    });

    it('should return state unchanged if instance not found', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.UPDATE_INSTANCE_CONNECTION_STATUS,
        payload: {
          host: 'https://example.com',
          connected: true,
        },
      };

      const result = reducer(state, action);

      expect(result).toEqual(state);
    });
  });

  describe('REMOVE_SESSION action', () => {
    it('should remove session by uuid', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
          {
            uuid: 'uuid2',
            account: 'user2',
            host: 'https://example.com',
            auth_key: 'key2',
            init: false,
            whitelist: [],
          },
        ],
        instances: [{host: 'https://example.com', init: false}],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REMOVE_SESSION,
        payload: {
          uuid: 'uuid1',
        },
      };

      const result = reducer(state, action);

      expect(result.sessions).toHaveLength(1);
      expect(result.sessions[0].uuid).toBe('uuid2');
      expect(result.instances).toHaveLength(1); // Instance still exists because uuid2 uses same host
    });

    it('should remove instance when no sessions use it', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [
          {host: 'https://example.com', init: false},
          {host: 'https://other.com', init: false},
        ],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REMOVE_SESSION,
        payload: {
          uuid: 'uuid1',
        },
      };

      const result = reducer(state, action);

      expect(result.sessions).toHaveLength(0);
      expect(result.instances).toHaveLength(0); // Both instances removed because no sessions use them
    });

    it('should keep instance if other sessions use it', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
          {
            uuid: 'uuid2',
            account: 'user2',
            host: 'https://example.com',
            auth_key: 'key2',
            init: false,
            whitelist: [],
          },
        ],
        instances: [{host: 'https://example.com', init: false}],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.REMOVE_SESSION,
        payload: {
          uuid: 'uuid1',
        },
      };

      const result = reducer(state, action);

      expect(result.sessions).toHaveLength(1);
      expect(result.instances).toHaveLength(1); // Instance kept because uuid2 uses it
    });
  });

  describe('ADD_WHITELISTED_OPERATION action', () => {
    it('should add operation to session whitelist', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_WHITELISTED_OPERATION,
        payload: {
          uuid: 'uuid1',
          operation: KeychainRequestTypes.transfer,
        },
      };

      const result = reducer(state, action);

      expect(result.sessions[0].whitelist).toContain(
        KeychainRequestTypes.transfer,
      );
    });

    it('should handle multiple whitelist operations', () => {
      const state: HAS_State = {
        sessions: [
          {
            uuid: 'uuid1',
            account: 'user1',
            host: 'https://example.com',
            auth_key: 'key1',
            init: false,
            whitelist: [],
          },
        ],
        instances: [],
      };

      const action1: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_WHITELISTED_OPERATION,
        payload: {
          uuid: 'uuid1',
          operation: KeychainRequestTypes.transfer,
        },
      };

      const result1 = reducer(state, action1);

      const action2: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_WHITELISTED_OPERATION,
        payload: {
          uuid: 'uuid1',
          operation: KeychainRequestTypes.delegation,
        },
      };

      const result2 = reducer(result1, action2);

      expect(result2.sessions[0].whitelist).toHaveLength(2);
      expect(result2.sessions[0].whitelist).toContain(
        KeychainRequestTypes.transfer,
      );
      expect(result2.sessions[0].whitelist).toContain(
        KeychainRequestTypes.delegation,
      );
    });

    it('should handle session not found gracefully', () => {
      const state: HAS_State = {
        sessions: [],
        instances: [],
      };

      const action: HAS_Actions = {
        type: HAS_ActionsTypes.ADD_WHITELISTED_OPERATION,
        payload: {
          uuid: 'nonexistent-uuid',
          operation: KeychainRequestTypes.transfer,
        },
      };

      // The reducer uses optional chaining, so it won't throw but won't add anything either
      const result = reducer(state, action);
      expect(result).toEqual(state);
      expect(result.sessions).toHaveLength(0);
    });
  });
});
