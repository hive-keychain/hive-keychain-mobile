import {ExtendedAccount} from '@hiveio/dhive';
import keyValidation, {
  getPublicKeyFromPrivateKeyString,
  validateFromObject,
} from 'utils/keyValidation';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import objects from '__tests__/utils-for-testing/helpers/objects';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
afterAllTest.clearAllMocks;
describe('keyValidation tests:\n', () => {
  const {keys, name} = testAccount._default;
  describe('getPublicKeyFromPrivateKeyString cases:\n', () => {
    it('Must return null if error', () => {
      expect(getPublicKeyFromPrivateKeyString('password')).toBeNull();
    });

    it('Must return public key from active', () => {
      expect(getPublicKeyFromPrivateKeyString(keys.active)).toBe(
        keys.activePubkey,
      );
    });

    it('Must return public key from posting', () => {
      expect(getPublicKeyFromPrivateKeyString(keys.posting)).toBe(
        keys.postingPubkey,
      );
    });

    it('Must return public key from memo', () => {
      expect(getPublicKeyFromPrivateKeyString(keys.memo)).toBe(keys.memoPubkey);
    });
  });

  describe('validateFromObject cases:\n', () => {
    it('Must return null', async () => {
      const clonedExtendedAccount = objects.clone(
        testAccount.extended,
      ) as ExtendedAccount;
      clonedExtendedAccount.active.key_auths = [['bad_password1234', 1]];
      clonedExtendedAccount.posting.key_auths = [['bad_password1234', 1]];
      clonedExtendedAccount.memo_key = 'bad_password1234';
      hiveUtilsMocks.getClient.database.getAccounts(clonedExtendedAccount);
      expect(await validateFromObject({name, keys})).toBeNull();
    });

    it('Must return null if no keys', async () => {
      hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
      expect(await validateFromObject({name, keys: {}})).toBeNull();
    });

    it('Must return all private keys', async () => {
      hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
      expect(await validateFromObject({name, keys})).toEqual(keys);
    });
  });

  describe('keyValidation cases', () => {
    it('Must throw unhandled error if password is public', async () => {
      try {
        hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
        await keyValidation(name, keys.activePubkey);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            'This is a public key! Please enter a private key or your master key.',
          ),
        );
      }
    });

    it('Must validate key', async () => {
      hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
      expect(await keyValidation(name, keys.active)).toEqual({
        active: keys.active,
        activePubkey: keys.activePubkey,
      });
    });

    it('Must return all passwords from master', async () => {
      hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
      expect(await keyValidation(name, testAccount.otherKeys.master)).toEqual(
        keys,
      );
    });
  });
});
