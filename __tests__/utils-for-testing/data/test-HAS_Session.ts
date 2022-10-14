import {
  HAS_Session,
  HAS_Token,
} from 'utils/hiveAuthenticationService/has.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testAuthKey from './test-auth-key';
import testUuidData from './test-uuid-data';

export default {
  has_session: {
    _default: {
      account: testAccount._default.name,
      uuid: testUuidData._default,
      token: {
        app: 'app',
        token: 'token',
        expiration: 10,
      } as HAS_Token,
      auth_key: testAuthKey.randomString,
    } as HAS_Session,
  },
};
