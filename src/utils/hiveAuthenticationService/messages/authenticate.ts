import assert from 'assert';
import Crypto from 'crypto-js';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import HAS from '..';
import {HAS_AuhtDecrypted, HAS_AuthPayload} from '../payloads.types';

export const processAuthenticationRequest = (
  has: HAS,
  payload: HAS_AuthPayload,
) => {
  has.checkPayload(payload);
  const accountSession = has.sessions.find(
    (e) => e.account === payload.account && e.uuid === payload.uuid,
  );
  assert(accountSession, 'This account has not been connected through HAS.');

  const data: HAS_AuhtDecrypted = JSON.parse(
    Crypto.AES.decrypt(payload.data, accountSession.auth_key).toString(
      Crypto.enc.Utf8,
    ),
  );
  payload.decryptedData = data;
  console.log(payload);

  navigate('ModalScreen', {
    name: ModalComponent.HAS_AUTH,
    data: {...payload, callback: has.answerAuthReq},
  });
};
