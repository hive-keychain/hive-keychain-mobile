import {addSessionToken} from 'actions/hiveAuthenticationService';
import {SessionTime} from 'components/hive_authentication_service/Auth';
import Crypto from 'crypto-js';
import uuid from 'react-native-uuid';
import {store} from 'store';
import HAS from '..';
import {HAS_Session} from '../has.types';
import {HAS_AuthChallengeData, HAS_AuthPayload} from '../payloads.types';
import {findSessionByToken, findSessionByUUID} from '../static';
import {dAppChallenge, getChallengeData} from './challenge';

export const answerAuthReq = async (
  has: HAS,
  payload: HAS_AuthPayload,
  approve: boolean,
  sessionTime: SessionTime,
  callback: () => void,
) => {
  try {
    const hour = 60 * 60 * 1000;
    let expiration_delay = hour;
    switch (sessionTime) {
      case SessionTime.HOUR:
        expiration_delay = hour;
        break;
      case SessionTime.DAY:
        expiration_delay = 24 * hour;
        break;
      case SessionTime.WEEK:
        expiration_delay = 7 * 24 * hour;
        break;
      case SessionTime.MONTH:
        expiration_delay = 30 * 24 * hour;
        break;
    }
    // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
    //       Secure PKSA should read it from the QR code scanned by the user
    let session = findSessionByToken(payload.token);
    let newToken = false;
    if (!session) {
      session = findSessionByUUID(payload.uuid);
      newToken = true;
    }
    if (approve) {
      let auth_ack_data: HAS_AuthChallengeData;
      if (newToken) {
        const token = uuid.v4() as string;
        const expire = Date.now() + expiration_delay;
        auth_ack_data = {
          token,
          expire,
        };
        const sessionToken = {
          token: token,
          expiration: expire,
          app: payload.decryptedData.app.name,
          ts_create: new Date().toISOString(),
          ts_expire: new Date(expire).toISOString(),
        };
        store.dispatch(addSessionToken(payload.uuid, sessionToken));
      } else {
        auth_ack_data = {
          token: session.token.token,
          expire: session.token.expiration,
        };
      }
      await sendAuth(has, payload, session, auth_ack_data);
    } else {
      //TODO: Discuss nack with arcange, why does it need challenge?
      has.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
    }
    callback();
    // remove expired tokens
  } catch (e) {
    console.log(e);
    // has.send(
    //   JSON.stringify({
    //     cmd: 'auth_err',
    //     uuid: payload.uuid,
    //     error: 'Request canceled by user',
    //   }),
    // );
  }
};

export const sendAuth = async (
  has: HAS,
  payload: HAS_AuthPayload,
  session: HAS_Session,
  auth_ack_data: HAS_AuthChallengeData,
) => {
  if (payload.decryptedData.challenge) {
    auth_ack_data.challenge = (await getChallengeData(
      session,
      payload.account,
      payload.decryptedData.challenge,
      false,
    )) as {challenge: string; pubkey: string};
  } else if (payload.decryptedData?.app?.pubkey) {
    auth_ack_data.challenge = await dAppChallenge(
      payload.account,
      payload.decryptedData.app.pubkey,
      payload.account,
    );
  }
  const data = Crypto.AES.encrypt(
    JSON.stringify(auth_ack_data),
    session.auth_key,
  ).toString();
  has.send(
    JSON.stringify({
      cmd: 'auth_ack',
      uuid: payload.uuid,
      data,
    }),
  );
};
