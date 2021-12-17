import {signBuffer} from 'components/bridge';
import Crypto from 'crypto-js';
import {RootState, store} from 'store';
import {KeychainKeyTypesLC} from 'utils/keychain.types';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import HAS from '..';
import {HAS_Session} from '../has.types';
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
        callback: answerChallengeReq,
        domain: token.app,
        session,
        has,
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
    const accounts = (store.getState() as RootState).accounts;
    const account = accounts.find((e) => e.name === payload.account);
    const challenge = await signBuffer(
      account.keys[payload.decrypted_data.key_type as KeychainKeyTypesLC],
      payload.decrypted_data.challenge,
    );
    const pubkey =
      account.keys[
        `${payload.decrypted_data.key_type as KeychainKeyTypesLC}Pubkey`
      ];
    const data = {challenge, pubkey};
    const signedData = Crypto.AES.encrypt(
      JSON.stringify(data),
      session.auth_key,
    ).toString();
    has.send(
      JSON.stringify({
        cmd: 'challenge_ack',
        data: signedData,
        uuid: payload.uuid,
      }),
    );
    callback(true);
  }
};
