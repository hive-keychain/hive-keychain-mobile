import {HAS_ChallengeDecryptedData} from 'utils/hiveAuthenticationService/payloads.types';
import {KeychainKeyTypesLC} from 'utils/keychain.types';

export default {
  _default: {
    key_type: KeychainKeyTypesLC.active,
    challenge: 'challenge',
  } as HAS_ChallengeDecryptedData,
};
