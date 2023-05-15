import {removeHASSession} from 'actions/hiveAuthenticationService';
import Crypto from 'crypto-js';
import {store} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, navigate} from 'utils/navigation';
import HAS from '..';
import {
  answerAuthReq,
  sendAuth,
  validateAuthPayloadAndGetData,
} from '../helpers/auth';
import {HAS_AuthPayload} from '../payloads.types';

export const processAuthenticationRequest = (
  has: HAS,
  payload: HAS_AuthPayload,
) => {
  HAS.checkPayload(payload);
  console.log('hoho');
  const {session, data} = validateAuthPayloadAndGetData(has, payload);
  if (!session) {
    has.awaitingAuth.push(payload);
    return;
  }
  console.log('hi', session, data);
  payload.decryptedData = data;

  if (session.token) {
    sendAuth(has, payload, session, {
      token: session.token.token,
      expire: session.token.expiration,
    });
  } else {
    navigate('ModalScreen', {
      name: ModalComponent.HAS_AUTH,
      data: {
        ...payload,
        has,
        callback: answerAuthReq,
        onExpire: () => {
          store.dispatch(removeHASSession(session.uuid));
          goBack();
        },
        onForceCloseModal: () => {
          const challenge = Crypto.AES.encrypt(
            payload.uuid,
            session.auth_key,
          ).toString();
          has.send(
            JSON.stringify({
              cmd: 'auth_nack',
              uuid: payload.uuid,
              data: challenge,
            }),
          );
          store.dispatch(removeHASSession(session.uuid));
          goBack();
        },
      },
    });
  }
};
