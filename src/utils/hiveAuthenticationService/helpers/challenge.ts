import {removeHASSession} from 'actions/hiveAuthenticationService';
import {encodeMemo} from 'components/bridge';
import {RootState, store} from 'store';
import HAS from '..';
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
    const session = (store.getState() as RootState).hive_authentication_service.sessions.find(
      (e) => e.account === username,
    );
    if (session) {
      store.dispatch(removeHASSession(session.uuid));
      has.send(
        JSON.stringify({
          cmd: 'auth_err',
          uuid: session.uuid,
          error: 'Request was canceled by the user.',
        }),
      );
    }
  }
};
