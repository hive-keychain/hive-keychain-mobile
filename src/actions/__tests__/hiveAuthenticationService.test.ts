import {KeychainRequestTypes} from 'src/interfaces/keychain.interface';
import {
  addServerKey,
  addSessionToken,
  addWhitelistedOperationToSession,
  clearHASState,
  removeHASSession,
  showHASInitRequestAsTreated,
  treatHASRequest,
  updateInstanceConnectionStatus,
} from '../hiveAuthenticationService';

describe('hiveAuthenticationService actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('treatHASRequest', () => {
    it('should treat HAS request', () => {
      const mockRequest = {
        type: 'auth_req',
        key: 'test-key',
        data: {},
      };
      const action = treatHASRequest(mockRequest as any);
      expect(action.type).toBe('HAS_REQUEST');
      expect(action.payload.auth_key).toBe('test-key');
    });
  });

  describe('showHASInitRequestAsTreated', () => {
    it('should show HAS request as treated', () => {
      const action = showHASInitRequestAsTreated('host.com');
      expect(action.type).toBe('HAS_REQUEST_TREATED');
      expect(action.payload).toBe('host.com');
    });
  });

  describe('addSessionToken', () => {
    it('should add session token', () => {
      const action = addSessionToken('uuid', {token: 'test'} as any);
      expect(action.type).toBe('HAS_ADD_TOKEN');
    });
  });

  describe('addServerKey', () => {
    it('should add server key', () => {
      const action = addServerKey('host.com', 'server-key');
      expect(action.type).toBe('HAS_ADD_SERVER_KEY');
    });
  });

  describe('clearHASState', () => {
    it('should clear HAS state', () => {
      const action = clearHASState();
      expect(action.type).toBe('HAS_CLEAR');
    });
  });

  describe('updateInstanceConnectionStatus', () => {
    it('should update instance connection status to connected', () => {
      const action = updateInstanceConnectionStatus('host.com', true);
      expect(action.type).toBe('HAS_UPDATE_INSTANCE_CONNECTION_STATUS');
      expect(action.payload).toEqual({host: 'host.com', connected: true});
    });

    it('should update instance connection status to disconnected', () => {
      const action = updateInstanceConnectionStatus('host.com', false);
      expect(action.type).toBe('HAS_UPDATE_INSTANCE_CONNECTION_STATUS');
      expect(action.payload).toEqual({host: 'host.com', connected: false});
    });
  });

  describe('removeHASSession', () => {
    it('should remove HAS session', () => {
      const action = removeHASSession('uuid-123');
      expect(action.type).toBe('HAS_REMOVE_SESSION');
      expect(action.payload).toEqual({uuid: 'uuid-123'});
    });
  });

  describe('addWhitelistedOperationToSession', () => {
    it('should add whitelisted operation to session', () => {
      const action = addWhitelistedOperationToSession(
        'uuid-123',
        KeychainRequestTypes.transfer,
      );
      expect(action.type).toBe('HAS_ADD_WHITELISTED_OPERATION');
      expect(action.payload).toEqual({
        uuid: 'uuid-123',
        operation: KeychainRequestTypes.transfer,
      });
    });
  });
});
