import {HAS_ActionsTypes} from 'actions/types';
import HAS from 'utils/hiveAuthenticationService';
import {HAS_PayloadType} from 'utils/hiveAuthenticationService/payloads.types';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
import hasSpy from '__tests__/utils-for-testing/mocks/spies/has-spy';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import testAccount from '../../test-account';

const cases = [
  {
    webSocketEvent: {
      data: {cmd: HAS_PayloadType.CONNECTED},
    } as WebSocketMessageEvent,
    assertion: (result: any) => {
      expect(result).toBeUndefined();
    },
  },
  {
    webSocketEvent: {
      data: {cmd: HAS_PayloadType.ERROR},
    } as WebSocketMessageEvent,
    assertion: (result: any, event: WebSocketMessageEvent) => {
      expect(result).toBeUndefined();
      expect(consoleSpy.log).toBeCalledWith('HAS error', event.data);
    },
    toClear: [consoleSpy.log] as jest.SpyInstance[],
  },
  {
    webSocketEvent: {
      data: {cmd: HAS_PayloadType.REGISTER, account: testAccount._default.name},
    } as WebSocketMessageEvent,
    assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
      expect(result).toBeUndefined();
      expect(consoleSpy.log).toBeCalledWith('HAS register_ack', event.data);
      expect(has.awaitingRegistration.length).toBe(1);
    },
    toClear: [consoleSpy.log] as jest.SpyInstance[],
  },
  {
    webSocketEvent: {
      data: {
        cmd: HAS_PayloadType.KEY_ACK,
        key: testAccount._default.keys.activePubkey,
      },
    } as WebSocketMessageEvent,
    assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
      expect(result).toBeUndefined();
      expect(storeSpy.dispatchWithoutImplementation).toBeCalledWith({
        payload: {host: has.host, server_key: event.data.key},
        type: HAS_ActionsTypes.ADD_SERVER_KEY,
      });
      expect(hasSpy.registerAccounts).toBeCalledTimes(1);
      expect(has.awaitingRegistration.length).toBe(1);
    },
    toClear: [
      consoleSpy.log,
      storeSpy.dispatchWithoutImplementation,
      hasSpy.registerAccounts,
    ] as jest.SpyInstance[],
  },
  {
    webSocketEvent: {
      data: {
        cmd: HAS_PayloadType.AUTH,
      },
    } as WebSocketMessageEvent,
    assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
      expect(result).toBeUndefined();
      expect(hasSpy.send).toBeCalledWith(JSON.stringify({cmd: 'auth_wait'}));
      expect(
        asModuleSpy.authenticate.processAuthenticationRequest,
      ).toBeCalledWith(has, event.data);
    },
    toClear: [
      hasSpy.send,
      asModuleSpy.authenticate.processAuthenticationRequest,
    ] as jest.SpyInstance[],
  },
  {
    webSocketEvent: {
      data: {
        cmd: HAS_PayloadType.SIGN,
      },
    } as WebSocketMessageEvent,
    assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
      expect(result).toBeUndefined();
      expect(hasSpy.send).toBeCalledWith(JSON.stringify({cmd: 'sign_wait'}));
      expect(asModuleSpy.sign.processSigningRequest).toBeCalledWith(
        has,
        event.data,
      );
    },
    toClear: [
      hasSpy.send,
      asModuleSpy.sign.processSigningRequest,
    ] as jest.SpyInstance[],
  },
  {
    webSocketEvent: {
      data: {
        cmd: HAS_PayloadType.CHALLENGE,
      },
    } as WebSocketMessageEvent,
    assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
      expect(result).toBeUndefined();
      expect(
        asModuleSpy.challenge.messages.processChallengeRequest,
      ).toBeCalledWith(has, event.data);
    },
    toClear: [
      asModuleSpy.challenge.messages.processChallengeRequest,
    ] as jest.SpyInstance[],
  },
];

export default {cases};
