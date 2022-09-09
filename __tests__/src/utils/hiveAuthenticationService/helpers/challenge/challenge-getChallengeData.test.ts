import {getChallengeData} from 'utils/hiveAuthenticationService/helpers/challenge';
import storeDispatch from '__tests__/utils-for-testing/data/store/store-dispatch';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testHAS_ChallengeDecryptedData from '__tests__/utils-for-testing/data/test-HAS_ChallengeDecryptedData';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import bridgeModuleMocks from '__tests__/utils-for-testing/mocks/as-module/as-index-file/bridge-module-mocks';
import cryptoJSModuleMocks from '__tests__/utils-for-testing/mocks/as-module/cryptoJS-module-mocks';
describe('challenge tests:\n', () => {
  afterEach(async () => {
    await storeDispatch.clear('forgetAccounts');
    await storeDispatch.clear('HAS_CLEAR');
    jest.clearAllMocks();
  });
  describe('getChallengeData cases:\n', () => {
    it('Must return data encrypted', async () => {
      cryptoJSModuleMocks.AES.encrypt('super_encrypted');
      bridgeModuleMocks.signBuffer(false, 'encrypted_DATA');
      await storeDispatch.one('ADD_ACCOUNT', {
        addAccount: {account: testAccount._default},
      });
      expect(
        await getChallengeData(
          testHAS_Session.has_session._default,
          testAccount._default.name,
          testHAS_ChallengeDecryptedData._default,
          true,
        ),
      ).toBe('super_encrypted');
    });
    it('Must return data', async () => {
      cryptoJSModuleMocks.AES.encrypt('super_encrypted');
      bridgeModuleMocks.signBuffer(false, 'encrypted_DATA');
      await storeDispatch.one('ADD_ACCOUNT', {
        addAccount: {account: testAccount._default},
      });
      expect(
        await getChallengeData(
          testHAS_Session.has_session._default,
          testAccount._default.name,
          testHAS_ChallengeDecryptedData._default,
          false,
        ),
      ).toEqual({
        challenge: 'encrypted_DATA',
        pubkey: testAccount._default.keys.activePubkey,
      });
    });
  });
});
