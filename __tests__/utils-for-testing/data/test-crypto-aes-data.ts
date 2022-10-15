import Crypto from 'crypto-js';
import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';

export default {
  /**
   * auth_ack_data: object or string. It will be stringified here.
   */
  encrypt: (auth_ack_data: any, session: HAS_Session) =>
    Crypto.AES.encrypt(
      JSON.stringify(auth_ack_data),
      session.auth_key,
    ).toString(),
  decrypt: {
    utf8: (encryptedData: string, key: string) =>
      Crypto.AES.decrypt(encryptedData, key).toString(Crypto.enc.Utf8),
  },
};
