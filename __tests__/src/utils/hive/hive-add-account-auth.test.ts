import {AuthorityType, ExtendedAccount} from '@hiveio/dhive';
import {addAccountAuth} from 'utils/hive';
import {
  KeychainKeyTypes,
  RequestAddAccountAuthority,
} from 'utils/keychain.types';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testRequest from '__tests__/utils-for-testing/data/test-request';
import method from '__tests__/utils-for-testing/helpers/method';
import objects from '__tests__/utils-for-testing/helpers/objects';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import hiveTxMocks from '__tests__/utils-for-testing/mocks/hive-tx/hive-tx-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/addAccountAuth cases:\n', () => {
  const {active: activeKey, posting: postingKey} = testAccount._default.keys;
  const {sucess: successResponse} = testBroadcastResponse;
  beforeEach(() => {
    hiveTxMocks.tx.create();
    hiveTxMocks.tx.sign();
    hiveTxMocks.tx.broadcast(successResponse);
  });
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  it('Must throw unhandled error is account auth active exists', async () => {
    const clonedExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    clonedExtendedAccount.active.account_auths = [['quentin', 1]];
    hiveUtilsMocks.getClient.database.getAccounts(clonedExtendedAccount);
    try {
      await addAccountAuth(activeKey, testRequest.addaccountAuth);
    } catch (error) {
      expect(error).toEqual(new Error('Already has authority'));
    }
  });

  it('Must throw unhandled error is account auth posting exists', async () => {
    const clonedExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    clonedExtendedAccount.active.account_auths = [];
    clonedExtendedAccount.posting.account_auths = [['quentin', 1]];
    const clonedRequest = objects.clone(
      testRequest.addaccountAuth,
    ) as RequestAddAccountAuthority;
    clonedRequest.role = KeychainKeyTypes.posting;
    hiveUtilsMocks.getClient.database.getAccounts(clonedExtendedAccount);
    try {
      await addAccountAuth(postingKey, clonedRequest);
    } catch (error) {
      expect(error).toEqual(new Error('Already has authority'));
    }
  });

  it('Must call broadcast when adding active auth', async () => {
    hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
    expect(await addAccountAuth(activeKey, testRequest.addaccountAuth)).toEqual(
      successResponse.result,
    );
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(activeKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect(
      (calls[0][1][0][1].active as AuthorityType).account_auths[0][0],
    ).toBe('quentin');
  });

  it('Must call broadcast when adding posting auth', async () => {
    const clonedRequest = objects.clone(
      testRequest.addaccountAuth,
    ) as RequestAddAccountAuthority;
    clonedRequest.role = KeychainKeyTypes.posting;
    hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
    expect(await addAccountAuth(postingKey, clonedRequest)).toEqual(
      successResponse.result,
    );
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(postingKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect(
      (calls[0][1][0][1].posting as AuthorityType).account_auths[0][0],
    ).toBe('quentin');
  });
});
