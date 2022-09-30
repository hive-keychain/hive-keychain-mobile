import {logScreenView} from 'utils/analytics';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import dataInitialMocks from '__tests__/utils-for-testing/config-test/data-initial-mocks';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
afterEachTest.clearAllMocks;
describe('analytics tests:\n', () => {
  describe('logScreenView cases:\n', () => {
    it('Must catch and log the error', async () => {
      dataInitialMocks.firebase.analytics.logScreenView = {
        causeError: true,
        errorMessage: 'logScreenView Error',
      };
      expect(await logScreenView('WalletScreen')).toBeUndefined();
      expect(consoleSpy.log).toBeCalledWith(
        'error analytics',
        new Error('logScreenView Error'),
      );
    });
    it('Must call logScreenView', async () => {
      dataInitialMocks.firebase.analytics.logScreenView = {
        causeError: false,
        errorMessage: '',
      };
      expect(await logScreenView('WalletScreen')).toBeUndefined();
      expect(consoleSpy.log).not.toBeCalled();
    });
  });
});
