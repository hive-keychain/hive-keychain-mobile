import assert from 'assert';
import Crypto from 'crypto-js';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, navigate} from 'utils/navigation';
import HAS from '..';
import {answerAuthReq} from '../helpers/auth';
import {HAS_AuthDecrypted, HAS_AuthPayload} from '../payloads.types';

export const processAuthenticationRequest = (
  has: HAS,
  payload: HAS_AuthPayload,
) => {
  HAS.checkPayload(payload);

  let accountSession = HAS.findSessionByToken(payload.token);
  if (!accountSession) {
    accountSession = HAS.findSessionByUUID(payload.uuid);
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

  navigate('ModalScreen', {
    name: ModalComponent.HAS_AUTH,
    data: {
      ...payload,
      has,
      callback: answerAuthReq,
      onForceCloseModal: () => {
        has.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
        goBack();
      },
    },
  });
};
