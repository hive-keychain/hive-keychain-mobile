import {addSessionToken} from 'actions/hiveAuthenticationService';
import Crypto from 'crypto-js';
import uuid from 'react-native-uuid';
import {store} from 'store';
import HAS from '..';
import {HAS_AuthChallengeData, HAS_AuthPayload} from '../payloads.types';
import {dAppChallenge} from './challenge';

export const answerAuthReq = async (
  has: HAS,
  payload: HAS_AuthPayload,
  approve: boolean,
  callback: () => void,
) => {
  try {
    // NOTE: The default expiration time for a token is 24 hours - It can be set to a longer duration for "service" APPS
    const EXPIRE_DELAY_APP = 24 * 60 * 60 * 1000;
    // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
    //       Secure PKSA should read it from the QR code scanned by the user
    const session = HAS.findSessionByUUID(payload.uuid);
    const app_key = session.auth_key;

    if (approve) {
      const token = uuid.v4() as string;
      const expire = Date.now() + EXPIRE_DELAY_APP;
      const auth_ack_data: HAS_AuthChallengeData = {
        token,
        expire,
      };
      if (payload.decryptedData.app.pubkey) {
        auth_ack_data.challenge = await dAppChallenge(
          payload.account,
          payload.decryptedData.app.pubkey,
          payload.account,
        );
      }

      const data = Crypto.AES.encrypt(
        JSON.stringify(auth_ack_data),
        app_key,
      ).toString();
      has.send(
        JSON.stringify({
          cmd: 'auth_ack',
          uuid: payload.uuid,
          data,
        }),
      );
      const sessionToken = {
        token: token,
        expiration: expire,
        app: payload.decryptedData.app.name,
        ts_create: new Date().toISOString(),
        ts_expire: new Date(expire).toISOString(),
      };
      store.dispatch(addSessionToken(payload.uuid, sessionToken));
    } else {
      has.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
    }
    callback();
    // remove expired tokens
  } catch (e) {
    console.log(e);
    has.send(
      JSON.stringify({
        cmd: 'auth_err',
        uuid: payload.uuid,
        error: 'Request canceled by user',
      }),
    );
  }
};
