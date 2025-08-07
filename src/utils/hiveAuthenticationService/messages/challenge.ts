import Crypto from 'crypto-js';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, navigate} from 'utils/navigation';
import HAS from '..';
import {HAS_Session} from '../has.types';
import {getChallengeData} from '../helpers/challenge';
import {HAS_ChallengePayload} from '../payloads.types';
import {findSessionByToken} from '../static';

export const processChallengeRequest = (
  has: HAS,
  payload: HAS_ChallengePayload,
) => {
  const session = findSessionByToken(payload.token);
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
        callback: answerChallengeReq,
        domain: token.app,
        session,
        has,

        onForceCloseModal: () => {
          const challenge = Crypto.AES.encrypt(
            payload.uuid,
            session.auth_key,
          ).toString();
          has.send(
            JSON.stringify({
              cmd: 'challenge_nack',
              uuid: payload.uuid,
              data: challenge,
            }),
          );
          goBack();
        },
      },
    });
  } else {
    //TODO
  }
};

const answerChallengeReq = async (
  has: HAS,
  payload: HAS_ChallengePayload,
  approve: boolean,
  session: HAS_Session,
  callback: (success: boolean) => void,
) => {
  if (approve) {
    const challengeData = await getChallengeData(
      session,
      payload.account,
      payload.decrypted_data,
      true,
    );
    has.send(
      JSON.stringify({
        cmd: 'challenge_ack',
        data: challengeData,
        uuid: payload.uuid,
      }),
    );
    callback(true);
  }
};
