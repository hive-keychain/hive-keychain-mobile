import {encodeMemo} from 'components/bridge';
import {RootState, store} from 'store';

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

export const prepareChallengeRequest = async (
  username: string,
  serverKey: string,
  message: string,
) => {
  try {
    const key = getLeastDangerousKey(username);
    console.log(key);
    return {
      key_type: key.type,
      challenge: await encodeMemo(key.value, serverKey, `#${message}`),
      name: username,
    };
  } catch (e) {
    console.log('memo', e);
  }
};

export const getLeastDangerousKey = (username: string) => {
  const accounts = (store.getState() as RootState).accounts;
  const account = accounts.find((e) => e.name === username);
  if (!account) return null;
  else if (account.keys.memo) return {type: 'memo', value: account.keys.memo};
  else if (account.keys.posting)
    return {type: 'posting', value: account.keys.posting};
  else return {type: 'active', value: account.keys.active};
};
