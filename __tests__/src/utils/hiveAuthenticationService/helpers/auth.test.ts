import {waitFor} from '@testing-library/react-native';
import {HAS_ActionsTypes} from 'actions/types';
import {SessionTime} from 'components/hive_authentication_service/Auth';
import HAS from 'utils/hiveAuthenticationService';
import {answerAuthReq} from 'utils/hiveAuthenticationService/helpers/auth';
import {HAS_AuthPayload} from 'utils/hiveAuthenticationService/payloads.types';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import expirationTimeArray from '__tests__/utils-for-testing/data/array-cases/expiration-time-array';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHASAuthPayload from '__tests__/utils-for-testing/data/test-HAS-auth-payload';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import {
  emptyStateStore,
  initialEmptyStateStore,
} from '__tests__/utils-for-testing/data/test-initial-state';
import method from '__tests__/utils-for-testing/helpers/method';
import objects from '__tests__/utils-for-testing/helpers/objects';
import challengeModuleMock from '__tests__/utils-for-testing/mocks/as-module/challenge-module-mock';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import callbackSpy from '__tests__/utils-for-testing/mocks/spies/callback-spy';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
import HASClassSpy from '__tests__/utils-for-testing/mocks/spies/HAS-class-spy';
import hasSpy from '__tests__/utils-for-testing/mocks/spies/has-spy';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import {getFakeStore} from '__tests__/utils-for-testing/store/fake-store';
afterAllTest.clearAllMocks;
describe('auth tests:\n', () => {
  beforeEach(() => {
    cryptoJSModuleMocks.AES.encrypt('super_encrypted');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('answerAuthReq cases:\n', () => {
    const {payload} = testHASAuthPayload;
    const {has_session} = testHAS_Session;
    const {cases} = expirationTimeArray;
    it('Must call send and callback', async () => {
      mockHASClass.findSessionByToken(has_session._default);
      await answerAuthReq(
        testHas._default,
        payload.justUUID,
        false,
        SessionTime.HOUR,
        callbackSpy.empty,
      );
      await waitFor(() => {
        expect(hasSpy.send).toBeCalledWith(
          JSON.stringify({cmd: 'auth_nack', uuid: has_session._default.uuid}),
        );
        expect(callbackSpy.empty).toBeCalledTimes(1);
      });
    });
    it('Must call findSessionByUUID on each case', async () => {
      for (let i = 0; i < cases.length; i++) {
        const element = cases[i];
        mockHASClass.findSessionByToken(undefined);
        mockHASClass.findSessionByUUID(has_session._default);
        await answerAuthReq(
          testHas._default,
          payload.justUUID,
          false,
          element,
          callbackSpy.empty,
        );
        await waitFor(() => {
          expect(HASClassSpy.findSessionByUUID()).toBeCalledWith(
            has_session._default.uuid,
          );
          expect(hasSpy.send).toBeCalledWith(
            JSON.stringify({cmd: 'auth_nack', uuid: has_session._default.uuid}),
          );
          expect(callbackSpy.empty).toBeCalledTimes(1);
        });
        method.clearSpies([
          hasSpy.send,
          callbackSpy.empty,
          HASClassSpy.findSessionByUUID(),
        ]);
      }
    });
    it('Must dispatch with addSessionToken and send', async () => {
      mockHASClass.findSessionByToken(undefined);
      mockHASClass.findSessionByUUID(has_session._default);
      challengeModuleMock.getChallengeData({
        challenge: 'challenge',
        pubkey: 'pubKey',
      });
      const fakeStore = getFakeStore(initialEmptyStateStore);
      await answerAuthReq(
        testHas._default,
        payload.full,
        true,
        SessionTime.HOUR,
        callbackSpy.empty,
      );
      await waitFor(() => {
        expect(storeSpy.dispatch.mock.calls[0][0].type).toBe(
          HAS_ActionsTypes.ADD_TOKEN,
        );
        expect(fakeStore.getState()).toEqual(emptyStateStore);
        expect(hasSpy.send).toBeCalledWith(
          JSON.stringify({
            cmd: 'auth_ack',
            uuid: payload.full.uuid,
            data: 'super_encrypted',
          }),
        );
      });
    });
    it('Must call dAppChallenge and use expiration', async () => {
      mockHASClass.findSessionByToken(has_session._default);
      challengeModuleMock.dAppChallenge('data_in_challenge');
      const clonedPayload = objects.clone(payload.full) as HAS_AuthPayload;
      delete clonedPayload.decryptedData.challenge;
      await answerAuthReq(
        testHas._default,
        clonedPayload,
        true,
        SessionTime.HOUR,
        callbackSpy.empty,
      );
      await waitFor(() => {
        expect(asModuleSpy.challenge.dAppChallenge).toBeCalledWith(
          clonedPayload.account,
          clonedPayload.decryptedData.app.pubkey,
          clonedPayload.account,
        );
      });
    });
    it('Must catch and log error', async () => {
      const error = new Error('Error');
      HAS.findSessionByToken = jest.fn().mockImplementation(() => {
        throw error;
      });
      await answerAuthReq(
        testHas._default,
        payload.justUUID,
        false,
        SessionTime.DAY,
        callbackSpy.empty,
      );
      await waitFor(() => {
        expect(consoleSpy.log).toBeCalledWith(error);
      });
    });
  });
});
