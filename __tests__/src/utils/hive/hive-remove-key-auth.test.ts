import {AuthorityType, ExtendedAccount} from '@hiveio/dhive';
import {removeKeyAuth} from 'utils/hive';
import {
  KeychainKeyTypes,
  RequestRemoveKeyAuthority,
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
describe('hive/removekeyAuth cases:\n', () => {
  const {
    active: activeKey,
    posting: postingKey,
    postingPubkey,
  } = testAccount._default.keys;
  const {sucess: successResponse} = testBroadcastResponse;
  const {removeKeyAuthority: requestRemoveKeyAuthority} = testRequest;
  beforeEach(() => {
    hiveTxMocks.tx.create();
    hiveTxMocks.tx.sign();
    hiveTxMocks.tx.broadcast(successResponse);
  });
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  it('Must throw unhandled error is active key auth not exists', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.key_auths = [];
    cloneExtendedAccount.posting.key_auths = [];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    try {
      await removeKeyAuth(activeKey, requestRemoveKeyAuthority);
    } catch (error) {
      expect(error).toEqual(new Error('Missing authority'));
    }
  });

  it('Must throw unhandled error is posting key auth not exists', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.key_auths = [];
    cloneExtendedAccount.posting.key_auths = [];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    const cloneRequestRemoveAuthority = objects.clone(
      requestRemoveKeyAuthority,
    ) as RequestRemoveKeyAuthority;
    cloneRequestRemoveAuthority.role = KeychainKeyTypes.posting;
    try {
      await removeKeyAuth(activeKey, cloneRequestRemoveAuthority);
    } catch (error) {
      expect(error).toEqual(new Error('Missing authority'));
    }
  });

  it('Must call broadcast when removing active key authority', async () => {
    hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
    expect(
      await removeKeyAuth(activeKey, requestRemoveKeyAuthority),
    ).toBeUndefined();
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(activeKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect((calls[0][1][0][1].active as AuthorityType).key_auths.length).toBe(
      0,
    );
  });

  it('Must call broadcast when removing posting key authority', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.key_auths = [];
    cloneExtendedAccount.posting.key_auths = [[postingPubkey, 1]];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    const cloneRequestRemoveKeyAuthority = objects.clone(
      requestRemoveKeyAuthority,
    ) as RequestRemoveKeyAuthority;
    cloneRequestRemoveKeyAuthority.role = KeychainKeyTypes.posting;
    cloneRequestRemoveKeyAuthority.authorizedKey = postingPubkey;
    expect(
      await removeKeyAuth(postingKey, cloneRequestRemoveKeyAuthority),
    ).toBeUndefined();
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(postingKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect((calls[0][1][0][1].posting as AuthorityType).key_auths.length).toBe(
      0,
    );
  });
});
