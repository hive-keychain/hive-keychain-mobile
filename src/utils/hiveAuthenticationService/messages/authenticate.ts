import {removeHASSession} from 'actions/hiveAuthenticationService';
import {encodeMemo} from 'components/bridge';
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
import {getLeastDangerousKey} from '../helpers/keys';
import {HAS_AuthPayload} from '../payloads.types';

export const processAuthenticationRequest = (
  has: HAS,
  payload: HAS_AuthPayload,
) => {
  HAS.checkPayload(payload);
  const {session, data} = validateAuthPayloadAndGetData(has, payload);
  if (!session) {
    has.awaitingAuth.push(payload);
    return;
  }
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
        onForceCloseModal: async () => {
          const challenge = Crypto.AES.encrypt(
            payload.uuid,
            session.auth_key,
          ).toString();
          has.send(
            JSON.stringify({
              cmd: 'auth_nack',
              uuid: payload.uuid,
              data: challenge,
              pok: await encodeMemo(
                getLeastDangerousKey(session.account).value,
                has.getServerKey(),
                `#${payload.uuid}`,
              ),
            }),
          );
          store.dispatch(removeHASSession(session.uuid));
          goBack();
        },
      },
    });
  }
};
