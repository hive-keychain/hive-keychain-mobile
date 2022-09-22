import {waitFor} from '@testing-library/react-native';
import {HAS_ActionsTypes} from 'actions/types';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import {showHASInitRequest} from 'utils/hiveAuthenticationService';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testHAS_State from '__tests__/utils-for-testing/data/test-HAS_State';
import testHost from '__tests__/utils-for-testing/data/test-Host';
import objects from '__tests__/utils-for-testing/helpers/objects';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
afterAllTest.clearAllMocks;
//TODO
//  - get the logic to register an account
//  - mock prepareRegistrationChallenge to add account
//  - then you can test.
describe('index tests:\n', () => {
  describe('showHASInitRequest cases:\n', () => {
    it('Must call dispatch an navigate', async () => {
      expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
      await waitFor(() => {
        expect(storeSpy.dispatch).toBeCalledWith({
          payload: testHost._default,
          type: HAS_ActionsTypes.REQUEST_TREATED,
        });
        //expect(asModuleSpy.navigation.navigate).toBeCalledWith('');
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
});
