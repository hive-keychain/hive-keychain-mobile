import {addAccountAuth} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testRequest from '__tests__/utils-for-testing/data/test-request';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/addAccountAuth cases:\n', () => {
  const {active: activeKey} = testAccount._default.keys;
  it.skip('Must ...', async () => {
    //to mock
    // getClient().database.getAccounts([username])
    expect(await addAccountAuth(activeKey, testRequest.addaccountAuth)).toEqual(
      {},
    );
  });
});
