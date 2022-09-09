import {
  HAS_Session,
  HAS_Token,
} from 'utils/hiveAuthenticationService/has.types';

export default {
  has_session: {
    _default: {
      uuid: 'UUID-001',
      token: {
        app: 'app',
        token: 'token',
        expiration: 10,
      } as HAS_Token,
    } as HAS_Session,
  },
};
