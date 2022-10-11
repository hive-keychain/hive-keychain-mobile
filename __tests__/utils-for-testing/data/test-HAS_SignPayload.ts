import {KeyTypes} from 'actions/interfaces';
import {
  HAS_PayloadType,
  HAS_SignDecrypted,
  HAS_SignPayload,
} from 'utils/hiveAuthenticationService/payloads.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';

export default {
  _default: {
    cmd: HAS_PayloadType.SIGN,
    account: testAccount._default.name,
    token: 'token',
    data: 'data',
    decryptedData: {
      key_type: KeyTypes.active,
      ops: [],
      broadcast: true,
    } as HAS_SignDecrypted,
    uuid: 'uuid-01',
    expire: 10,
  } as HAS_SignPayload,
};
