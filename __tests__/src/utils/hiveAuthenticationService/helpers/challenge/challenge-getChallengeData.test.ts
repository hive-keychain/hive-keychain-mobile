import {getChallengeData} from 'utils/hiveAuthenticationService/helpers/challenge';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testCryptoAesData from '__tests__/utils-for-testing/data/test-crypto-aes-data';
import testHAS_ChallengeDecryptedData from '__tests__/utils-for-testing/data/test-HAS_ChallengeDecryptedData';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import {initialEmptyStateStore} from '__tests__/utils-for-testing/data/test-initial-state';
import bridgeModuleMocks from '__tests__/utils-for-testing/mocks/as-module/as-index-file/bridge-module-mocks';
import storeMock from '__tests__/utils-for-testing/mocks/store-mock';
afterAllTest.clearAllMocks;
describe('challenge tests:\n', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    storeMock.getState({
      ...initialEmptyStateStore,
      accounts: [testAccount._default],
    });
    bridgeModuleMocks.signBuffer(false, 'encrypted_DATA');
  });
  describe('getChallengeData cases:\n', () => {
    const {_default: session} = testHAS_Session.has_session;
    it('Must return data encrypted', async () => {
      const challengeData = await getChallengeData(
        session,
        testAccount._default.name,
        testHAS_ChallengeDecryptedData._default,
        true,
      );
      expect(
        testCryptoAesData.decrypt.utf8(
          challengeData as string,
          session.auth_key,
        ),
      ).toBe(
        JSON.stringify({
          challenge: 'encrypted_DATA',
          pubkey: testAccount._default.keys.activePubkey,
        }),
      );
    });
    it('Must return data', async () => {
      expect(
        await getChallengeData(
          session,
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
