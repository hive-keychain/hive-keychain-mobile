import {
  HAS_ChallengeDecryptedData,
  HAS_ChallengePayload,
  HAS_PayloadType,
} from 'utils/hiveAuthenticationService/payloads.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';

export default {
  full: {
    cmd: HAS_PayloadType.CHALLENGE,
    account: testAccount._default.name,
    token: 'token',
    data: 'data',
    decrypted_data: {
      key_type: 'key_type',
      challenge: 'challenge',
    } as HAS_ChallengeDecryptedData,
    uuid: 'uuid-01',
  } as HAS_ChallengePayload,
};
