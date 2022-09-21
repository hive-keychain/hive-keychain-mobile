import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import objects from '__tests__/utils-for-testing/helpers/objects';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import simpletoastMock from '__tests__/utils-for-testing/mocks/simpletoast-mock';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';

const {_default: session} = testHAS_Session.has_session;

const cases = [
  {
    description: 'undefined session',
    mocking: () => {
      mockHASClass.checkPayload;
      mockHASClass.findSessionByToken(undefined);
      simpletoastMock.show;
    },
    assertion: () => {
      const callingParams = [
        'AssertionError [ERR_ASSERTION]: This account has not been connected through HAS.',
        undefined,
      ];
      expect(asModuleSpy.simpleToast.show).toBeCalledWith(...callingParams);
      expect(consoleSpy.log).toBeCalledTimes(1);
    },
    toClear: [
      consoleSpy.log,
      asModuleSpy.simpleToast.show,
    ] as jest.SpyInstance[],
  },
  {
    description: 'session token expired',
    mocking: () => {
      const clonedSession = objects.clone(session) as HAS_Session;
      clonedSession.token.expiration = 0;
      mockHASClass.checkPayload;
      mockHASClass.findSessionByToken(clonedSession);
      simpletoastMock.show;
    },
    assertion: () => {
      const callingParams = [
        'AssertionError [ERR_ASSERTION]: Token invalid or expired',
        undefined,
      ];
      expect(asModuleSpy.simpleToast.show).toBeCalledWith(...callingParams);
      expect(consoleSpy.log).toBeCalledTimes(1);
    },
    toClear: [
      consoleSpy.log,
      asModuleSpy.simpleToast.show,
    ] as jest.SpyInstance[],
  },
  {
    description: 'decrypted data not json',
    mocking: () => {
      const clonedSession = objects.clone(session) as HAS_Session;
      clonedSession.token.expiration = Date.now() + 10000;
      mockHASClass.checkPayload;
      mockHASClass.findSessionByToken(clonedSession);
      simpletoastMock.show;
      cryptoJSModuleMocks.AES.decrypt('decrypted_not_json');
    },
    assertion: () => {
      const callingParams = [
        'SyntaxError: Unexpected token d in JSON at position 0',
        undefined,
      ];
      expect(asModuleSpy.simpleToast.show).toBeCalledWith(...callingParams);
      expect(consoleSpy.log).toBeCalledTimes(1);
    },
    toClear: [
      consoleSpy.log,
      asModuleSpy.simpleToast.show,
    ] as jest.SpyInstance[],
  },
];
export default {cases};
