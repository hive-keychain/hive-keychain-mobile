import {
  HAS_Session,
  HAS_Token,
} from 'utils/hiveAuthenticationService/has.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';

export default {
  has_session: {
    _default: {
      account: testAccount._default.name,
      uuid: 'UUID-001',
      token: {
        app: 'app',
        token: 'token',
        expiration: 10,
      } as HAS_Token,
    } as HAS_Session,
  },
};
