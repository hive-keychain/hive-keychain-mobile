import {Account} from 'actions/interfaces';
import {getLeastDangerousKey} from 'utils/hiveAuthenticationService/helpers/keys';
import storeDispatch from '__tests__/utils-for-testing/data/store/store-dispatch';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import objects from '__tests__/utils-for-testing/helpers/objects';
describe('keys tests:\n', () => {
  afterEach(async () => {
    await storeDispatch.clear('forgetAccounts');
    jest.clearAllMocks();
  });
  it('Must return null', () => {
    expect(getLeastDangerousKey(testAccount._default.name)).toBeNull();
  });
  it('Must return memo key', async () => {
    await storeDispatch.one('ADD_ACCOUNT', {
      addAccount: {account: testAccount._default},
    });
    expect(getLeastDangerousKey(testAccount._default.name)).toEqual({
      type: 'memo',
      value: testAccount._default.keys.memo,
    });
  });
  it('Must return posting key', async () => {
    const clonedAccount = objects.clone(testAccount._default) as Account;
    delete clonedAccount.keys.memo;
    await storeDispatch.one('ADD_ACCOUNT', {
      addAccount: {account: clonedAccount},
    });
    expect(getLeastDangerousKey(testAccount._default.name)).toEqual({
      type: 'posting',
      value: clonedAccount.keys.posting,
    });
  });
  it('Must return active key', async () => {
    const clonedAccount = objects.clone(testAccount._default) as Account;
    delete clonedAccount.keys.memo;
    delete clonedAccount.keys.posting;
    await storeDispatch.one('ADD_ACCOUNT', {
      addAccount: {account: clonedAccount},
    });
    expect(getLeastDangerousKey(testAccount._default.name)).toEqual({
      type: 'active',
      value: clonedAccount.keys.active,
    });
  });
});
