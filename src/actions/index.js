import {
  SIGN_UP,
  ADD_ACCOUNT,
  FORGET_ACCOUNTS,
  LOCK,
  UNLOCK,
  INIT_ACCOUNTS,
} from './types';
import {encryptJson, decryptToJson} from '../utils/encrypt';
import * as Keychain from 'react-native-keychain';
import {navigate} from '../navigationRef';

export const signUp = (pwd) => {
  console.log('navigate out');
  navigate('AddAccountScreen');
  return {type: SIGN_UP, payload: pwd};
};

export const addAccount = (name, keys) => async (dispatch, getState) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  console.log(mk.previousAccounts);
  dispatch({type: ADD_ACCOUNT, payload: {name, keys}});
  const accounts = [...previousAccounts, {name, keys}];
  console.log(accounts, mk);
  const encrypted = encryptJson({list: accounts}, mk);
  console.log(await Keychain.getSupportedBiometryType());
  console.log(Keychain.ACCESS_CONTROL);
  await Keychain.setGenericPassword('accounts2', 'encrypted', {
    accessControl: 'Fingerprint',
    service: 'accountss',
  });
};

export const unlock = (mk) => async (dispatch, getState) => {
  try {
    Keychain.getSupportedBiometryType().then((data) => {
      console.log('Supported biometry: ' + data);

      if (data) {
        // Try auto login
        Keychain.getGenericPassword({
          service: 'accountss',
          authenticationPrompt: {title: 'prompt'},
        }).then((credentials) => {
          const accountsEncrypted = credentials.password;
          console.log(accountsEncrypted);
          const accounts = decryptToJson(accountsEncrypted, mk);
          if (accounts && accounts.list) {
            dispatch({type: UNLOCK, payload: mk});
            dispatch({type: INIT_ACCOUNTS, payload: accounts.list});
          }
          console.log(INIT_ACCOUNTS);
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const lock = () => {
  return {type: LOCK};
};

export const forgetAccounts = () => ({
  type: FORGET_ACCOUNTS,
});
