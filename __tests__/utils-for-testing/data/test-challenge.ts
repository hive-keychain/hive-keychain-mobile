import {KeychainKeyTypesLC} from 'utils/keychain.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';

export default {
  _default: {
    key_type: KeychainKeyTypesLC.active,
    challenge: 'challenge',
    name: testAccount._default.name,
  },
};
