import {
  SIGN_UP,
  ADD_ACCOUNT,
  FORGET_ACCOUNTS,
  LOCK,
  UNLOCK,
  INIT_ACCOUNTS,
  ACTIVE_ACCOUNT,
  GLOBAL_PROPS,
} from './types';
import {encryptJson, decryptToJson} from '../utils/encrypt';
import * as Keychain from 'react-native-keychain';
import {navigate} from '../navigationRef';
import Toast from 'react-native-simple-toast';
import {translate} from '../utils/localize';
import {client} from '../utils/dhive';
import {chunkArray} from '../utils/format';

export const signUp = (pwd) => {
  navigate('AddAccountByKeyScreen');
  return {type: SIGN_UP, payload: pwd};
};

export const addAccount = (name, keys) => async (dispatch, getState) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  dispatch({type: ADD_ACCOUNT, payload: {name, keys}});
  const accounts = [...previousAccounts, {name, keys}];
  const encrypted = encryptJson({list: accounts}, mk);
  const chunks = chunkArray(encrypted.split(''), 300).map((e) => e.join(''));
  for (const [i, chunk] of chunks.entries()) {
    await Keychain.setGenericPassword(`accounts_${chunks.length}`, chunk, {
      accessControl:
        i === 0
          ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE
          : null,
      service: `accounts_${i}`,
      storage: Keychain.STORAGE_TYPE.RSA,
    });
  }
};

export const unlock = (mk, errorCallback) => async (dispatch, getState) => {
  try {
    let accountsEncrypted = '';
    let i = 0;
    let length = 10;
    while (i < length) {
      const cred = await Keychain.getGenericPassword({
        service: `accounts_${i}`,
        authenticationPrompt: {title: 'Authenticate'},
      });
      if (i === 0) {
        length = cred.username.replace('accounts_', '');
      }
      accountsEncrypted += cred.password;
      i++;
    }
    const accounts = decryptToJson(accountsEncrypted, mk);
    if (accounts && accounts.list) {
      dispatch({type: UNLOCK, payload: mk});
      dispatch({type: INIT_ACCOUNTS, payload: accounts.list});
    }
    console.log(INIT_ACCOUNTS);
  } catch (e) {
    console.log(e, e.message);
    if (e.message === 'Wrapped error: User not authenticated') {
      errorCallback(true);
    } else {
      Toast.show(translate('toast.authFailed'));
      errorCallback();
    }
  }
};

export const lock = () => {
  return {type: LOCK};
};

export const forgetAccounts = () => (dispatch) => {
  dispatch({
    type: FORGET_ACCOUNTS,
  });
};

export const loadAccount = (username) => async (dispatch, getState) => {
  const account = (await client.database.getAccounts([username]))[0];
  const keys = getState().accounts.find((e) => e.name === username).keys;
  console.log(ACTIVE_ACCOUNT);
  dispatch({
    type: ACTIVE_ACCOUNT,
    payload: {
      account,
      keys,
    },
  });
};

export const loadProperties = () => async (dispatch) => {
  const props = await client.database.getDynamicGlobalProperties();
  dispatch({type: GLOBAL_PROPS, payload: props});
};
