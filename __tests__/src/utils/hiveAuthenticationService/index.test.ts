import {waitFor} from '@testing-library/react-native';
import {HAS_ActionsTypes} from 'actions/types';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import HAS, {
  clearHAS,
  getHAS,
  restartHASSockets,
  showHASInitRequest,
} from 'utils/hiveAuthenticationService';
import {KeychainKeyTypesLC} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testChallenge from '__tests__/utils-for-testing/data/test-challenge';
import testHAS_Instance from '__tests__/utils-for-testing/data/test-HAS_Instance';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import testHAS_State from '__tests__/utils-for-testing/data/test-HAS_State';
import testHost from '__tests__/utils-for-testing/data/test-Host';
import {emptyStateStore} from '__tests__/utils-for-testing/data/test-initial-state';
import objects from '__tests__/utils-for-testing/helpers/objects';
import challengeModuleMock from '__tests__/utils-for-testing/mocks/as-module/challenge-module-mock';
import simpletoastMock from '__tests__/utils-for-testing/mocks/simpletoast-mock';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import storeMock from '__tests__/utils-for-testing/mocks/store-mock';
afterAllTest.clearAllMocks;
describe('index tests:\n', () => {
  const addHASConnection = () => showHASInitRequest(testHAS_State._default);
  afterEach(() => {
    clearHAS();
  });
  describe('showHASInitRequest cases:\n', () => {
    it('Must call dispatch', async () => {
      expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
      await waitFor(() => {
        expect(storeSpy.dispatchCb()).toBeCalledWith({
          payload: testHost._default,
          type: HAS_ActionsTypes.REQUEST_TREATED,
        });
      });
    });
    it('Must close and disconnect instance', async () => {
      expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
      const clonedHAS_State = objects.clone(
        testHAS_State._default,
      ) as HAS_State;
      clonedHAS_State.instances[0].host = testHost.other;
      expect(showHASInitRequest(clonedHAS_State)).toBeUndefined();
      await waitFor(() => {
        expect(storeSpy.dispatchCb()).toBeCalledTimes(6);
      });
    });
  });
  describe('clearHAS cases:\n', () => {
    it('Must dispatch clear action', async () => {
      addHASConnection();
      expect(clearHAS()).toBeUndefined();
      await waitFor(() => {
        expect(storeSpy.dispatchCb()).toBeCalledWith({
          type: HAS_ActionsTypes.CLEAR,
        });
      });
    });
  });
  describe('restartHASSockets cases:/n', () => {
    it('Must call restartHASSockets', async () => {
      addHASConnection();
      await waitFor(() => {
        expect(restartHASSockets()).toBeUndefined();
      });
    });
  });
  describe('getHAS cases:\n', () => {
    it('Must return new has', async () => {
      expect(JSON.stringify(getHAS(testHost._default))).toEqual(
        JSON.stringify(new HAS(testHost._default)),
      );
    });
    it('Must return actual has', async () => {
      const actualHas = new HAS(testHost._default);
      actualHas.awaitingRegistration = [testAccount._default.name];
      addHASConnection();
      await waitFor(() => {
        expect(JSON.stringify(getHAS(testHost._default))).toEqual(
          JSON.stringify(actualHas),
        );
      });
    });
  });
  describe('HAS cases:\n', () => {
    const newHAS = new HAS(testHost._default);
    it('Must return a HAS instance calling initConnection', () => {
      expect(newHAS).toBeInstanceOf(HAS);
    });
    it('Must add account to awaitingRegistration', async () => {
      storeMock.getState({
        ...emptyStateStore,
        hive_authentication_service: {
          instances: [testHAS_Instance._default],
          sessions: [testHAS_Session.has_session._default],
        },
      });
      challengeModuleMock.helpers.prepareRegistrationChallenge(
        testChallenge._default,
      );
      simpletoastMock.show;
      await waitFor(() => {
        expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
        const {
          calls: callsSimpleToastSpy,
        } = asModuleSpy.simpleToast.show().mock;
        const {
          calls: callsWebSocketSpySend,
        } = asModuleSpy.webSocketSpy.send.mock;
        expect(callsSimpleToastSpy[callsSimpleToastSpy.length - 1][0]).toBe(
          translate('wallet.has.toast.register'),
        );
        expect(callsWebSocketSpySend[callsWebSocketSpySend.length - 1]).toEqual(
          [
            JSON.stringify({
              cmd: 'register_req',
              app: 'Hive Keychain',
              accounts: [
                {
                  key_type: KeychainKeyTypesLC.active,
                  challenge: testChallenge._default.challenge,
                  name: testAccount._default.name,
                },
              ],
            }),
          ],
        );
      });
    });
  });
});
