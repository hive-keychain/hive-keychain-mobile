import {AuthorityType, ExtendedAccount} from '@hiveio/dhive';
import {removeAccountAuth} from 'utils/hive';
import {
  KeychainKeyTypes,
  RequestRemoveAccountAuthority,
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
describe('hive/removeAccountAuth cases:\n', () => {
  const {active: activeKey, posting: postingKey} = testAccount._default.keys;
  const {sucess: successResponse} = testBroadcastResponse;
  const {removeAccountAuth: removeAccountRequest} = testRequest;
  beforeEach(() => {
    hiveTxMocks.tx.create();
    hiveTxMocks.tx.sign();
    hiveTxMocks.tx.broadcast(successResponse);
  });
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  it('Must throw unhandled error is account auth active not exists', async () => {
    hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
    try {
      await removeAccountAuth(activeKey, removeAccountRequest);
    } catch (error) {
      expect(error).toEqual(new Error('Nothing to remove'));
    }
  });

  it('Must throw unhandled error is account auth posting not exists', async () => {
    const clonedRequest = objects.clone(
      removeAccountRequest,
    ) as RequestRemoveAccountAuthority;
    clonedRequest.role = KeychainKeyTypes.posting;
    hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
    try {
      await removeAccountAuth(postingKey, clonedRequest);
    } catch (error) {
      expect(error).toEqual(new Error('Nothing to remove'));
    }
  });

  it('Must call broadcast when removing active auth', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.account_auths = [['quentin', 1]];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    expect(await removeAccountAuth(activeKey, removeAccountRequest)).toEqual(
      successResponse.result,
    );
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(activeKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect(
      (calls[0][1][0][1].active as AuthorityType).account_auths.length,
    ).toBe(0);
  });

  it('Must call broadcast when removing posting auth', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.posting.account_auths = [['quentin', 1]];
    const cloneRemoveAccountRequest = objects.clone(
      removeAccountRequest,
    ) as RequestRemoveAccountAuthority;
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    cloneRemoveAccountRequest.role = KeychainKeyTypes.posting;
    expect(
      await removeAccountAuth(postingKey, cloneRemoveAccountRequest),
    ).toEqual(successResponse.result);
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(postingKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect(
      (calls[0][1][0][1].posting as AuthorityType).account_auths.length,
    ).toBe(0);
  });
});
