jest.mock('store', () => ({
  store: {
    getState: jest.fn(),
  },
}));

import {checkPayload, findSessionByToken, findSessionByUUID} from '../static';
import {HAS_AuthPayload, HAS_SignPayload} from '../payloads.types';
import {store} from 'store';

describe('hiveAuthenticationService static utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkPayload', () => {
    it('should not throw for valid auth payload', () => {
      const payload: HAS_AuthPayload = {
        uuid: 'test-uuid',
        expire: Date.now() + 10000,
        account: 'testuser',
        token: 'test-token',
      };
      expect(() => checkPayload(payload)).not.toThrow();
    });

    it('should not throw for valid sign payload', () => {
      const payload: HAS_SignPayload = {
        uuid: 'test-uuid',
        expire: Date.now() + 10000,
        account: 'testuser',
        message: 'test message',
      } as HAS_SignPayload;
      expect(() => checkPayload(payload)).not.toThrow();
    });

    it('should not throw if uuid is missing (non-app request)', () => {
      const payload: any = {
        expire: Date.now() + 10000,
        account: 'testuser',
      };
      // If uuid is missing, checkPayload doesn't validate (it's not an app request)
      expect(() => checkPayload(payload)).not.toThrow();
    });

    it('should throw if uuid is not a string', () => {
      const payload: any = {
        uuid: 123,
        expire: Date.now() + 10000,
        account: 'testuser',
      };
      expect(() => checkPayload(payload)).toThrow('invalid payload (uuid)');
    });

    it('should throw if expire is missing', () => {
      const payload: any = {
        uuid: 'test-uuid',
        account: 'testuser',
      };
      expect(() => checkPayload(payload)).toThrow('invalid payload (expire)');
    });

    it('should throw if expire is not a number', () => {
      const payload: any = {
        uuid: 'test-uuid',
        expire: 'not-a-number',
        account: 'testuser',
      };
      expect(() => checkPayload(payload)).toThrow('invalid payload (expire)');
    });

    it('should throw if account is missing', () => {
      const payload: any = {
        uuid: 'test-uuid',
        expire: Date.now() + 10000,
      };
      expect(() => checkPayload(payload)).toThrow('invalid payload (account)');
    });

    it('should throw if account is not a string', () => {
      const payload: any = {
        uuid: 'test-uuid',
        expire: Date.now() + 10000,
        account: 123,
      };
      expect(() => checkPayload(payload)).toThrow('invalid payload (account)');
    });

    it('should throw if request has expired', () => {
      const payload: HAS_AuthPayload = {
        uuid: 'test-uuid',
        expire: Date.now() - 1000, // Expired 1 second ago
        account: 'testuser',
        token: 'test-token',
      };
      expect(() => checkPayload(payload)).toThrow('request expired');
    });

    it('should not throw for payload without uuid (non-app request)', () => {
      const payload: any = {
        account: 'testuser',
      };
      expect(() => checkPayload(payload)).not.toThrow();
    });
  });

  describe('findSessionByUUID', () => {
    it('should find session by UUID', () => {
      const mockSessions = [
        {uuid: 'uuid-1', account: 'user1'},
        {uuid: 'uuid-2', account: 'user2'},
      ];
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: mockSessions,
        },
      });

      const result = findSessionByUUID('uuid-1');
      expect(result).toEqual({uuid: 'uuid-1', account: 'user1'});
    });

    it('should return undefined if session not found', () => {
      const mockSessions = [
        {uuid: 'uuid-1', account: 'user1'},
        {uuid: 'uuid-2', account: 'user2'},
      ];
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: mockSessions,
        },
      });

      const result = findSessionByUUID('uuid-3');
      expect(result).toBeUndefined();
    });

    it('should handle empty sessions array', () => {
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: [],
        },
      });

      const result = findSessionByUUID('uuid-1');
      expect(result).toBeUndefined();
    });
  });

  describe('findSessionByToken', () => {
    it('should find session by token', () => {
      const mockSessions = [
        {uuid: 'uuid-1', account: 'user1', token: {token: 'token-1'}},
        {uuid: 'uuid-2', account: 'user2', token: {token: 'token-2'}},
      ];
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: mockSessions,
        },
      });

      const result = findSessionByToken('token-1');
      expect(result).toEqual({
        uuid: 'uuid-1',
        account: 'user1',
        token: {token: 'token-1'},
      });
    });

    it('should return undefined if session not found', () => {
      const mockSessions = [
        {uuid: 'uuid-1', account: 'user1', token: {token: 'token-1'}},
        {uuid: 'uuid-2', account: 'user2', token: {token: 'token-2'}},
      ];
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: mockSessions,
        },
      });

      const result = findSessionByToken('token-3');
      expect(result).toBeUndefined();
    });

    it('should handle sessions without token', () => {
      const mockSessions = [
        {uuid: 'uuid-1', account: 'user1'},
        {uuid: 'uuid-2', account: 'user2', token: {token: 'token-2'}},
      ];
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: mockSessions,
        },
      });

      const result = findSessionByToken('token-1');
      expect(result).toBeUndefined();
    });

    it('should handle empty sessions array', () => {
      (store.getState as jest.Mock).mockReturnValue({
        hive_authentication_service: {
          sessions: [],
        },
      });

      const result = findSessionByToken('token-1');
      expect(result).toBeUndefined();
    });
  });
});

