import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {KeychainRequestTypes} from 'utils/keychain.types';
import testHASSignDecrypted from '__tests__/utils-for-testing/data/test-HAS-signDecrypted';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import objects from '__tests__/utils-for-testing/helpers/objects';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import simpletoastMock from '__tests__/utils-for-testing/mocks/simpletoast-mock';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';

const {_default: session} = testHAS_Session.has_session;
const {_default: opsData} = testHASSignDecrypted;

const cases = [
  {
    description: 'single op as account_create',
    mocking: async () => {
      //   await storeDispatch.one('ADD_ACCOUNT', {
      //     addAccount: {account: testAccount._default},
      //   });
      simpletoastMock.show;
      cryptoJSModuleMocks.AES.decrypt(JSON.stringify(opsData));
      mockHASClass.checkPayload;

      navigationModuleMocks.navigateWParams(false);

      const clonedSession = objects.clone(session) as HAS_Session;
      clonedSession.token.expiration = Date.now() + 10000;
      clonedSession.whitelist = [];
      mockHASClass.findSessionByToken(clonedSession);
    },
    assertion: () => {
      const {calls: callingParams} = asModuleSpy.navigation.navigate.mock;
      expect(callingParams[0][0]).toBe('ModalScreen');
      expect(JSON.stringify(callingParams[0][1])).toContain(
        KeychainRequestTypes.broadcast,
      );
    },
    toClear: [asModuleSpy.navigation.navigate] as jest.SpyInstance[],
    // afterTest: () => {
    //   storeDispatch.clear('forgetAccounts');
    // },
  },
];

export default {cases};
