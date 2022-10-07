import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';

export default {
  _default: {
    account: testAccount._default.name,
    uuid: 'uuid-01',
    host: 'host',
    auth_key: 'auth_key',
  } as HAS_ConnectPayload & {
    key: string;
  },
};
