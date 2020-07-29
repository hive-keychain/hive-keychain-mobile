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
import Toast from 'react-native-simple-toast';

export const signUp = (pwd) => {
  navigate('AddAccountByKeyScreen');
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
  const a = await Keychain.setGenericPassword('accounts2', encrypted, {
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    service: 'accounts2',
  });
  console.log(a);
};

export const unlock = (mk, errorCallback) => async (dispatch, getState) => {
  Keychain.getGenericPassword({
    service: 'accounts2',
    authenticationPrompt: {title: 'Authenticate'},
  })
    .then((credentials) => {
      const accountsEncrypted = credentials.password;
      console.log(credentials, accountsEncrypted);
      const accounts = decryptToJson(accountsEncrypted, mk);
      if (accounts && accounts.list) {
        dispatch({type: UNLOCK, payload: mk});
        dispatch({type: INIT_ACCOUNTS, payload: accounts.list});
      }
      console.log(INIT_ACCOUNTS);
    })
    .catch((e) => {
      console.log(e.message);
      if (e.message === 'Wrapped error: User not authenticated') {
        errorCallback(true);
      } else {
        Toast.show('Authentication failed');
        errorCallback();
      }
    });
};

export const lock = () => {
  return {type: LOCK};
};

export const forgetAccounts = () => ({
  type: FORGET_ACCOUNTS,
});
