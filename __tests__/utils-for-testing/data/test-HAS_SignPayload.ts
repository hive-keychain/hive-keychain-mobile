import {KeyTypes} from 'actions/interfaces';
import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {
  HAS_PayloadType,
  HAS_SignDecrypted,
  HAS_SignPayload,
} from 'utils/hiveAuthenticationService/payloads.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testCryptoAesData from './test-crypto-aes-data';
import testUuidData from './test-uuid-data';

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
    uuid: testUuidData._default,
    expire: 10,
  } as HAS_SignPayload,
  withDataToEncrypt: (dataToEncrypt: any, session: HAS_Session) => {
    return {
      cmd: HAS_PayloadType.SIGN,
      account: testAccount._default.name,
      token: 'token',
      data: testCryptoAesData.encrypt(dataToEncrypt, session),
      uuid: testUuidData._default,
      expire: 10,
    } as HAS_SignPayload;
  },
};
