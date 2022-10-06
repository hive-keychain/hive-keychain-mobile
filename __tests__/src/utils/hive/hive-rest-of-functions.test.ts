import {Client} from '@hiveio/dhive';
import {getClient, isTestnet} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/rest of functions cases:\n', () => {
  describe('isTestnet cases:\n', () => {
    it('Must return false', () => {
      expect(isTestnet()).toBe(false);
    });
  });

  describe('getClient cases:\n', () => {
    it('Must return client', () => {
      expect(getClient()).toBeInstanceOf(Client);
    });
  });
});
