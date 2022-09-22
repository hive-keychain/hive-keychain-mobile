import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {HAS_SignDecrypted} from 'utils/hiveAuthenticationService/payloads.types';
import {KeychainRequestTypes} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import objects from '__tests__/utils-for-testing/helpers/objects';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import requestWithoutConfirmationUtilsModuleMocks from '__tests__/utils-for-testing/mocks/as-module/request-without-confirmation-utils-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import simpletoastMock from '__tests__/utils-for-testing/mocks/simpletoast-mock';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';

const {_default: session} = testHAS_Session.has_session;

const templateCase = {
  mocking: (clonedOpsData: HAS_SignDecrypted, whiteListed?: boolean) => {
    simpletoastMock.show;
    cryptoJSModuleMocks.AES.decrypt(JSON.stringify(clonedOpsData));
    mockHASClass.checkPayload;
    navigationModuleMocks.navigateWParams(false);
    const clonedSession = objects.clone(session) as HAS_Session;
    clonedSession.token.expiration = Date.now() + 10000;
    clonedSession.whitelist = whiteListed
      ? [KeychainRequestTypes.broadcast]
      : [];
    mockHASClass.findSessionByToken(clonedSession);
    if (whiteListed) {
      asModuleSpy.simpleToast.show();
      requestWithoutConfirmationUtilsModuleMocks.requestWithoutConfirmation;
    }
  },
  assertion: (
    modalName: string,
    containType: KeychainRequestTypes,
    whiteListed?: boolean,
  ) => {
    if (!whiteListed) {
      const {calls: callingParams} = asModuleSpy.navigation.navigate.mock;
      expect(callingParams[0][0]).toBe(modalName);
      expect(JSON.stringify(callingParams[0][1])).toContain(containType);
    } else {
      expect(asModuleSpy.simpleToast.show().mock.calls[0][0]).toBe(
        translate('wallet.has.toast.broadcast'),
      );
      expect(asModuleSpy.requestWithoutConfirmation).toBeCalledTimes(1);
    }
  },
  clear: (spies: jest.SpyInstance[]) => spies.forEach((spy) => spy.mockClear()),
};

export default {templateCase};
