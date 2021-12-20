import assert from 'assert';
import Crypto from 'crypto-js';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import HAS from '..';
import {answerAuthReq} from '../helpers/auth';
import {HAS_AuhtDecrypted, HAS_AuthPayload} from '../payloads.types';

export const processAuthenticationRequest = (
  has: HAS,
  payload: HAS_AuthPayload,
) => {
  HAS.checkPayload(payload);
  console.log(payload);
  let accountSession = HAS.findSessionByToken(payload.token);
  if (!accountSession) {
    accountSession = HAS.findSessionByUUID(payload.uuid);
  }
  assert(accountSession, 'This account has not been connected through HAS.');
  console.log(accountSession, payload);
  const data: HAS_AuhtDecrypted = JSON.parse(
    Crypto.AES.decrypt(payload.data, accountSession.auth_key).toString(
      Crypto.enc.Utf8,
    ),
  );
  payload.decryptedData = data;
  console.log(payload);

  navigate('ModalScreen', {
    name: ModalComponent.HAS_AUTH,
    data: {...payload, has, callback: answerAuthReq},
  });
};
