import {removeHASSession} from 'actions/hiveAuthenticationService';
import Crypto from 'crypto-js';
import {store} from 'store';
import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {answerAuthReq} from 'utils/hiveAuthenticationService/helpers/auth';
import {processAuthenticationRequest} from 'utils/hiveAuthenticationService/messages/authenticate';
import {ModalComponent} from 'utils/modal.enum';
import {goBack} from 'utils/navigation';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHASAuthPayload from '__tests__/utils-for-testing/data/test-HAS-auth-payload';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import objects from '__tests__/utils-for-testing/helpers/objects';
import authUtilsModuleMock from '__tests__/utils-for-testing/mocks/as-module/auth-utils-module-mock';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterAllTest.clearAllMocks;
describe('authenticate tests"\n', () => {
  describe('processAuthenticationRequest cases:\n', () => {
    beforeEach(() => {
      mockHASClass.checkPayload;
      cryptoJSModuleMocks.AES.decrypt(JSON.stringify({enc: 'super_encrypted'}));
      cryptoJSModuleMocks.AES.encrypt('super_encrypted!');
    });
    const expectTobeUndefined = () => {
      expect(
        processAuthenticationRequest(
          testHas._default,
          testHASAuthPayload.payload.full,
        ),
      ).toBeUndefined();
    };
    it('Must push payload to awaitingAuth', () => {
      mockHASClass.findSessionByToken(undefined);
      mockHASClass.findSessionByUUID(undefined);
      expectTobeUndefined();
      expect(testHas._default.awaitingAuth).toEqual([
        testHASAuthPayload.payload.full,
      ]);
    });
    it('Must call sendAuth', () => {
      mockHASClass.findSessionByToken(testHAS_Session.has_session._default);
      authUtilsModuleMock.sendAuth;
      expectTobeUndefined();
      expect(asModuleSpy.sendAuth).toBeCalledWith(
        testHas._default,
        testHASAuthPayload.payload.full,
        testHAS_Session.has_session._default,
        {
          token: testHAS_Session.has_session._default.token.token,
          expire: testHAS_Session.has_session._default.token.expiration,
        },
      );
    });
    it('Must call navigate with params', () => {
      navigationModuleMocks.navigateWParams();
      const clonedHASSession = objects.clone(
        testHAS_Session.has_session._default,
      ) as HAS_Session;
      delete clonedHASSession.token;
      mockHASClass.findSessionByToken(clonedHASSession);
      expectTobeUndefined();
      const {calls} = asModuleSpy.navigation.navigate.mock;
      expect(calls[0][0]).toBe('ModalScreen');
      expect(JSON.stringify(calls[0][1])).toEqual(
        JSON.stringify({
          name: ModalComponent.HAS_AUTH,
          data: {
            ...testHASAuthPayload.payload.full,
            has: testHas._default,
            callback: answerAuthReq,
            onExpire: () => {
              store.dispatch(removeHASSession(clonedHASSession.uuid));
              goBack();
            },
            onForceCloseModal: () => {
              const challenge = Crypto.AES.encrypt(
                testHASAuthPayload.payload.full.uuid,
                clonedHASSession.auth_key,
              ).toString();
              testHas._default.send(
                JSON.stringify({
                  cmd: 'auth_nack',
                  uuid: testHASAuthPayload.payload.full.uuid,
                  data: challenge,
                }),
              );
              store.dispatch(removeHASSession(clonedHASSession.uuid));
              goBack();
            },
          },
        }),
      );
      expect(asModuleSpy.navigation.goBack).toBeCalledTimes(2);
    });
  });
});
