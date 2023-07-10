import assert, {AssertionError} from 'assert';
import {encodeMemo} from 'components/bridge';
import Crypto from 'crypto-js';
import HAS from '..';
import {
  HAS_AuthPayload,
  HAS_ChallengePayload,
  HAS_SignPayload,
} from '../payloads.types';
import {getLeastDangerousKey} from './keys';

export const answerSuccessfulBroadcastReq = async (
  has: HAS,
  payload: HAS_SignPayload,
  result: any,
) => {
  if (payload.decryptedData.broadcast) {
    has.send(
      JSON.stringify({
        cmd: 'sign_ack',
        uuid: payload.uuid,
        broadcast: payload.decryptedData.broadcast,
        data: result.result.tx_id,
        pok: await encodeMemo(
          getLeastDangerousKey(payload.account).value,
          has.getServerKey(),
          `#${payload.uuid}`,
        ),
      }),
    );
  } else {
    throw new Error('Transaction signing not implemented');
  }
};

export const answerFailedBroadcastReq = async (
  has: HAS,
  payload: HAS_SignPayload,
  error?: string,
) => {
  has.send(
    JSON.stringify({
      cmd: 'sign_nack',
      uuid: payload.uuid,
      pok: await encodeMemo(
        getLeastDangerousKey(payload.account).value,
        has.getServerKey(),
        `#${payload.uuid}`,
      ),
      error: error || 'Request was canceled by the user.',
    }),
  );
};

export const validatePayloadAndGetData = <T>(
  has: HAS,
  payload: HAS_SignPayload | HAS_ChallengePayload | HAS_AuthPayload,
) => {
  const version = parseInt(has.version);
  let session, data: T;

  if (!version) {
    session = HAS.findSessionByToken(payload.token);
    assert(session, 'This account has not been connected through HAS.');
    const auth =
      session.token.token === payload.token &&
      session.token.expiration > Date.now()
        ? session.token
        : undefined;

    assert(auth, 'Token invalid or expired');

    data = JSON.parse(
      Crypto.AES.decrypt(payload.data, session.auth_key).toString(
        Crypto.enc.Utf8,
      ),
    );
  } else if (version === 1) {
    const result = HAS.findSessionByDecryption(payload);
    if (result) {
      session = result.session;
      data = result.data;
    }
  } else new AssertionError({message: 'Invalid server version'});
  return {session, data};
};
