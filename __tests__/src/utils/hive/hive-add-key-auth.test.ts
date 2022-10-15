import {AuthorityType, ExtendedAccount} from '@hiveio/dhive';
import {addKeyAuth} from 'utils/hive';
import {KeychainKeyTypes, RequestAddKeyAuthority} from 'utils/keychain.types';
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
describe('hive/addkeyAuth cases:\n', () => {
  const {
    active: activeKey,
    posting: postingKey,
    postingPubkey,
  } = testAccount._default.keys;
  const {sucess: successResponse} = testBroadcastResponse;
  const {addKeyAuthority: requestAddKeyAuthority} = testRequest;
  beforeEach(() => {
    hiveTxMocks.tx.create();
    hiveTxMocks.tx.sign();
    hiveTxMocks.tx.broadcast(successResponse);
  });
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  it('Must throw unhandled error is active key auth exists', async () => {
    hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
    try {
      await addKeyAuth(activeKey, requestAddKeyAuthority);
    } catch (error) {
      expect(error).toEqual(new Error('already has authority'));
    }
  });

  it('Must throw unhandled error is posting key auth exists', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.key_auths = [];
    cloneExtendedAccount.posting.key_auths = [[postingPubkey, 1]];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    const cloneRequestAddKeyAuthority = objects.clone(
      requestAddKeyAuthority,
    ) as RequestAddKeyAuthority;
    cloneRequestAddKeyAuthority.role = KeychainKeyTypes.posting;
    try {
      await addKeyAuth(postingKey, cloneRequestAddKeyAuthority);
    } catch (error) {
      expect(error).toEqual(new Error('already has authority'));
    }
  });

  it('Must call broadcast when adding active key authority', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.key_auths = [];
    cloneExtendedAccount.posting.key_auths = [];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    expect(await addKeyAuth(activeKey, requestAddKeyAuthority)).toBeUndefined();
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(activeKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect((calls[0][1][0][1].active as AuthorityType).key_auths.length).toBe(
      1,
    );
  });

  it('Must call broadcast when adding posting key authority', async () => {
    const cloneExtendedAccount = objects.clone(
      testAccount.extended,
    ) as ExtendedAccount;
    cloneExtendedAccount.active.key_auths = [];
    cloneExtendedAccount.posting.key_auths = [];
    hiveUtilsMocks.getClient.database.getAccounts(cloneExtendedAccount);
    const cloneRequestAddKeyAuthority = objects.clone(
      requestAddKeyAuthority,
    ) as RequestAddKeyAuthority;
    cloneRequestAddKeyAuthority.role = KeychainKeyTypes.posting;
    expect(
      await addKeyAuth(postingKey, cloneRequestAddKeyAuthority),
    ).toBeUndefined();
    const {calls} = asModuleSpy.hiveUtils.broadcast.mock;
    expect(calls[0][0]).toBe(postingKey);
    expect(calls[0][1][0][0]).toBe('account_update');
    expect((calls[0][1][0][1].posting as AuthorityType).key_auths.length).toBe(
      1,
    );
  });
});
