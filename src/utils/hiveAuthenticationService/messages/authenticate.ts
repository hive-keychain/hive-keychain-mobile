import {removeHASSession} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import {encodeMemo} from 'components/bridge';
import Crypto from 'crypto-js';
import {store} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, navigate} from 'utils/navigation';
import HAS from '..';
import {answerAuthReq, sendAuth} from '../helpers/auth';
import {getLeastDangerousKey} from '../helpers/keys';
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
        onForceCloseModal: async () => {
          const challenge = Crypto.AES.encrypt(
            payload.uuid,
            accountSession.auth_key,
          ).toString();
          has.send(
            JSON.stringify({
              cmd: 'auth_nack',
              uuid: payload.uuid,
              data: challenge,
              pok: await encodeMemo(
                getLeastDangerousKey(accountSession.account).value,
                has.getServerKey(),
                `#${payload.uuid}`,
              ),
            }),
          );
          store.dispatch(removeHASSession(accountSession.uuid));
          goBack();
        },
      },
    });
  }
};
