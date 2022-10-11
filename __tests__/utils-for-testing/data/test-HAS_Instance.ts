import {HAS_Instance} from 'utils/hiveAuthenticationService/has.types';
import testHost from '__tests__/utils-for-testing/data/test-Host';

export default {
  _default: {
    host: testHost._default,
    server_key: 'server_key',
    init: false,
    connected: false,
  } as HAS_Instance,
};
