import {waitFor} from '@testing-library/react-native';
import {removeHASSession} from 'actions/hiveAuthenticationService';
import Crypto from 'crypto-js';
import {store} from 'store';
import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {
  answerChallengeReq,
  processChallengeRequest,
} from 'utils/hiveAuthenticationService/messages/challenge';
import {ModalComponent} from 'utils/modal.enum';
import {goBack} from 'utils/navigation';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHAS_ChallengePayload from '__tests__/utils-for-testing/data/test-HAS_ChallengePayload';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import objects from '__tests__/utils-for-testing/helpers/objects';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterAllTest.clearAllMocks;
describe('challenge tests:\n', () => {
  const {_default: has} = testHas;
  const payload = testHAS_ChallengePayload.full;
  const {_default: session} = testHAS_Session.has_session;
  describe('processChallengeRequest cases:\n', () => {
    it('Must call navigate', async () => {
      navigationModuleMocks.navigateWParams(true);
      const cloneSession = objects.clone(session) as HAS_Session;
      cloneSession.token.expiration = Date.now() + 10;
      cryptoJSModuleMocks.AES.decrypt(JSON.stringify({enc: 'super_encrypted'}));
      cryptoJSModuleMocks.AES.encrypt('super_encrypted!');
      mockHASClass.findSessionByToken(cloneSession);
      expect(processChallengeRequest(has, payload)).toBeUndefined();
      await waitFor(() => {
        const {calls} = asModuleSpy.navigation.navigate.mock;
        expect(calls[0][0]).toBe('ModalScreen');
        expect(JSON.stringify(calls[0][1])).toEqual(
          JSON.stringify({
            name: ModalComponent.HAS_CHALLENGE,
            data: {
              ...payload,
              callback: answerChallengeReq,
              domain: cloneSession.token.app,
              session: cloneSession,
              has,
              onForceCloseModal: () => {
                const challenge = Crypto.AES.encrypt(
                  payload.uuid,
                  cloneSession.auth_key,
                ).toString();
                testHas._default.send(
                  JSON.stringify({
                    cmd: 'auth_nack',
                    uuid: payload.uuid,
                    data: challenge,
                  }),
                );
                store.dispatch(removeHASSession(cloneSession.uuid));
                goBack();
              },
            },
          }),
        );
        expect(asModuleSpy.navigation.goBack).toBeCalledTimes(1);
      });
    });
    it('Must return undefined on TODO case', async () => {
      const cloneSession = objects.clone(session) as HAS_Session;
      cloneSession.token.expiration = Date.now() - 10;
      mockHASClass.findSessionByToken(cloneSession);
      await waitFor(() => {
        expect(processChallengeRequest(has, payload)).toBeUndefined();
      });
    });
  });
});
