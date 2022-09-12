import {AccountKeys} from 'actions/interfaces';
import {dAppChallenge} from 'utils/hiveAuthenticationService/helpers/challenge';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import storeDispatch from '__tests__/utils-for-testing/data/store/store-dispatch';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import objects from '__tests__/utils-for-testing/helpers/objects';
import bridgeModuleMocks from '__tests__/utils-for-testing/mocks/as-module/as-index-file/bridge-module-mocks';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
describe('challenge tests:\n', () => {
  afterEach(async () => {
    await storeDispatch.clear('forgetAccounts');
    await storeDispatch.clear('HAS_CLEAR');
    jest.clearAllMocks();
  });
  describe('dAppChallenge cases:\n', () => {
    it('Must return null if no account', async () => {
      expect(
        await dAppChallenge(
          testAccount._default.name,
          testAccount._default.keys.postingPubkey,
          'message',
        ),
      ).toBeNull();
    });
    it('Must return null if no posting key', async () => {
      const clonedKeys = objects.clone(
        testAccount._default.keys,
      ) as AccountKeys;
      delete clonedKeys.posting;
      await storeDispatch.one('ADD_ACCOUNT', {
        addAccount: {
          account: {
            ...testAccount._default,
            keys: clonedKeys,
          },
        },
      });
      expect(
        await dAppChallenge(
          testAccount._default.name,
          testAccount._default.keys.postingPubkey,
          'message',
        ),
      ).toBeNull();
    });
    it('Must return encoded message', async () => {
      bridgeModuleMocks.encodeMemo(false, 'encoded!');
      await storeDispatch.one('ADD_ACCOUNT', {
        addAccount: {account: testAccount._default},
      });
      expect(
        await dAppChallenge(
          testAccount._default.name,
          testAccount._default.keys.postingPubkey,
          'message',
        ),
      ).toBe('encoded!');
    });
    it('Must return undefined and log error', async () => {
      const error = new Error('Error encoding');
      bridgeModuleMocks.encodeMemo(true, error);
      await storeDispatch.one('ADD_ACCOUNT', {
        addAccount: {account: testAccount._default},
      });
      expect(
        await dAppChallenge(
          testAccount._default.name,
          testAccount._default.keys.postingPubkey,
          'message',
        ),
      ).toBeUndefined;
      expect(consoleSpy.log).toBeCalledWith('error encrypting', error);
    });
  });
});
