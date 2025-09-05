import {removeHASSession} from 'actions/hiveAuthenticationService';
import {encodeMemo, signBuffer} from 'components/bridge';
import Crypto from 'crypto-es';
import {RootState, store} from 'store';
import {KeychainKeyTypesLC} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import HAS from '..';
import {HAS_Session} from '../has.types';
import {HAS_ChallengeDecryptedData} from '../payloads.types';
import {getLeastDangerousKey} from './keys';

export const dAppChallenge = async (
  username: string,
  pubkey: string,
  message: string,
) => {
  try {
    const accounts = (store.getState() as RootState).accounts;
    const account = accounts.find((e) => e.name === username);
    if (!account) return null;
    const key = account.keys.posting;
    if (!key)
      //TODO : throw error;
      return null;
    return await encodeMemo(key, pubkey, `#${message}`);
  } catch (e) {
    console.log('error encrypting', e);
  }
};

export const prepareRegistrationChallenge = async (
  has: HAS,
  username: string,
  serverKey: string,
  message: string,
) => {
  try {
    const key = getLeastDangerousKey(username);
    if (key) {
      return {
        key_type: key.type,
        challenge: await encodeMemo(key.value, serverKey, `#${message}`),
        name: username,
      };
    } else {
      throw 'No username';
    }
  } catch (e) {
    const session = (
      store.getState() as RootState
    ).hive_authentication_service.sessions.find((e) => e.account === username);
    if (session) {
      navigate('ModalScreen', {
        name: ModalComponent.HAS_ERROR,
        data: {
          text: translate('wallet.has.connect.no_username', {
            account: username,
          }),
        },
      });
      store.dispatch(removeHASSession(session.uuid));
      has.send(
        JSON.stringify({
          cmd: 'auth_nack',
          uuid: session.uuid,
        }),
      );
    }
  }
};

export const getChallengeData = async (
  session: HAS_Session,
  username: string,
  decrypted_data: HAS_ChallengeDecryptedData,
  encrypt: boolean,
) => {
  const accounts = (store.getState() as RootState).accounts;
  const account = accounts.find((e) => e.name === username);
  const challenge = await signBuffer(
    account.keys[decrypted_data.key_type as KeychainKeyTypesLC],
    decrypted_data.challenge,
  );
  const pubkey =
    account.keys[`${decrypted_data.key_type as KeychainKeyTypesLC}Pubkey`];
  const data = {challenge, pubkey};

  return encrypt
    ? Crypto.AES.encrypt(JSON.stringify(data), session.auth_key).toString()
    : data;
};
