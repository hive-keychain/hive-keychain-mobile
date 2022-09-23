import {waitFor} from '@testing-library/react-native';
import {HAS_ActionsTypes} from 'actions/types';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import {store} from 'store';
import HAS, {
  clearHAS,
  getHAS,
  restartHASSockets,
  showHASInitRequest,
} from 'utils/hiveAuthenticationService';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testHAS_State from '__tests__/utils-for-testing/data/test-HAS_State';
import testHost from '__tests__/utils-for-testing/data/test-Host';
import objects from '__tests__/utils-for-testing/helpers/objects';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import {RootState} from '__tests__/utils-for-testing/store/fake-store';

afterAllTest.clearAllMocks;
describe('index tests:\n', () => {
  const addHASConnection = () => showHASInitRequest(testHAS_State._default);
  describe('showHASInitRequest cases:\n', () => {
    it('Must call dispatch', async () => {
      expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
      await waitFor(() => {
        expect(storeSpy.dispatch).toBeCalledWith({
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
        expect(storeSpy.dispatch).toHaveBeenLastCalledWith({
          payload: {connected: false, host: testHost.other},
          type: HAS_ActionsTypes.UPDATE_INSTANCE_CONNECTION_STATUS,
        });
      });
    });
  });
  describe('clearHAS cases:\n', () => {
    it('Must dispatch clear action', async () => {
      addHASConnection();
      expect(clearHAS()).toBeUndefined();
      await waitFor(() => {
        expect(storeSpy.dispatch).toBeCalledWith({
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
      actualHas.awaitingRegistration = [null];
      addHASConnection();
      expect(JSON.stringify(getHAS(testHost._default))).toEqual(
        JSON.stringify(actualHas),
      );
    });
  });
  describe('HAS cases:\n', () => {
    const newHAS = new HAS(testHost._default);
    it('Must return a HAS instance calling initConnection', () => {
      expect(newHAS).toBeInstanceOf(HAS);
    });
    it('Must add account to awaitingRegistration', async () => {
      //TODO this is was done on unit testing on extension.
      (store.getState() as RootState).phishingAccounts = ['1', '2'];
      await waitFor(() => {
        expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
        expect(getHAS(testHost._default).awaitingRegistration).toEqual([
          testAccount._default.name,
        ]);
      });
    });
  });
});
