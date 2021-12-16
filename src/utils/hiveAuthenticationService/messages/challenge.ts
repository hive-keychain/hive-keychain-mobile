import Crypto from 'crypto-js';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import HAS from '..';
import {HAS_ChallengePayload} from '../payloads.types';

export const processChallengeRequest = (
  has: HAS,
  payload: HAS_ChallengePayload,
) => {
  const session = HAS.findSessionByToken(payload.token);
  const token = session.token;
  if (token && token.expiration > Date.now()) {
    const decrypted_data = Crypto.AES.decrypt(
      payload.data,
      session.auth_key,
    ).toString(Crypto.enc.Utf8);
    payload.decrypted_data = JSON.parse(decrypted_data);
    navigate('ModalScreen', {
      name: ModalComponent.HAS_CHALLENGE,
      data: {
        ...payload,
        callback: has.answerChallengeReq,
        domain: token.app,
        session,
      },
    });
  } else {
    //TODO
  }
};
