import {ExtendedAccount} from '@hiveio/dhive';
import ProxyUtils from 'utils/proxy';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';

describe('proxy tests:\n', () => {
  describe('findUserProxy cases:\n', () => {
    it('Must return null if user has not proxy', async () => {
      hiveUtilsMocks.getClient.database.getAccounts({
        proxy: '',
      } as ExtendedAccount);
      expect(await ProxyUtils.findUserProxy(testAccount.extended)).toBeNull();
    });

    it("Must return user's account proxy", async () => {
      hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
      expect(
        await ProxyUtils.findUserProxy({
          name: 'theghost1980',
          proxy: testAccount._default.name,
        } as ExtendedAccount),
      ).toBe(testAccount._default.name);
    });
  });
});
