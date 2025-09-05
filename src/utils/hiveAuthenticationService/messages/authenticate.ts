import {removeHASSession} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import Crypto from 'crypto-es';
import {store} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, navigate} from 'utils/navigation';
import HAS from '..';
import {answerAuthReq, sendAuth} from '../helpers/auth';
import {HAS_AuthDecrypted, HAS_AuthPayload} from '../payloads.types';
import {checkPayload, findSessionByToken, findSessionByUUID} from '../static';

export const processAuthenticationRequest = (
  has: HAS,
  payload: HAS_AuthPayload,
) => {
  checkPayload(payload);

  let accountSession = findSessionByToken(payload.token);
  if (!accountSession) {
    accountSession = findSessionByUUID(payload.uuid);
  }
  if (!accountSession) {
    has.awaitingAuth.push(payload);
    return;
  }
  assert(accountSession, 'This account has not been connected through HAS.');
  const data: HAS_AuthDecrypted = JSON.parse(
    Crypto.AES.decrypt(payload.data, accountSession.auth_key).toString(
      Crypto.enc.Utf8,
    ),
  );
  payload.decryptedData = data;
  if (accountSession.token) {
    sendAuth(has, payload, accountSession, {
      token: accountSession.token.token,
      expire: accountSession.token.expiration,
    });
  } else {
    navigate('ModalScreen', {
      name: ModalComponent.HAS_AUTH,
      data: {
        ...payload,
        has,
        callback: answerAuthReq,
        onExpire: () => {
          store.dispatch(removeHASSession(accountSession.uuid));
          goBack();
        },
        onForceCloseModal: () => {
          const challenge = Crypto.AES.encrypt(
            payload.uuid,
            accountSession.auth_key,
          ).toString();
          has.send(
            JSON.stringify({
              cmd: 'auth_nack',
              uuid: payload.uuid,
              data: challenge,
            }),
          );
          store.dispatch(removeHASSession(accountSession.uuid));
          goBack();
        },
      },
    });
  }
};
