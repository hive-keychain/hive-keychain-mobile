import Crypto from 'crypto-js';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import HAS from '..';
import {HAS_ChallengePayload} from '../payloads.types';

export const processChallengeRequest = (
  has: HAS,
  payload: HAS_ChallengePayload,
) => {
  //has.checkPayload(payload);
  console.log(has.sessions, has);
  const session = has.sessions.find((e) => e.token.token === payload.token);
  const token = session.token;
  if (token && token.expiration > Date.now()) {
    console.log(payload.data);
    //console.log(token.auth_key);
    const decrypted_data = Crypto.AES.decrypt(
      payload.data,
      session.auth_key,
    ).toString(Crypto.enc.Utf8);
    payload.decrypted_data = JSON.parse(decrypted_data);
    console.log(session);
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
