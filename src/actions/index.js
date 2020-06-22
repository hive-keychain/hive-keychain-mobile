import {
  SIGN_UP,
  ADD_ACCOUNT,
  UPDATE_ACCOUNT_ENC,
  LOCK,
  UNLOCK,
  INIT_ACCOUNTS,
} from './types';
import {encryptJson, decryptToJson} from '../utils/encrypt';
import {navigate} from '../navigationRef';

export const signUp = (pwd) => {
  console.log('navigate out');
  navigate('AddAccountScreen');
  return {type: SIGN_UP, payload: pwd};
};

export const addAccount = (name, keys) => (dispatch, getState) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  console.log(mk.previousAccounts);
  dispatch({type: ADD_ACCOUNT, payload: {name, keys}});
  const accounts = [...previousAccounts, {name, keys}];
  console.log(accounts, mk);
  const encrypted = encryptJson({list: accounts}, mk);
  dispatch({type: UPDATE_ACCOUNT_ENC, payload: encrypted});
};

export const unlock = (mk) => (dispatch, getState) => {
  try {
    const accountsEncrypted = getState().accountsEncrypted;
    const accounts = decryptToJson(accountsEncrypted, mk);
    if (accounts && accounts.list) {
      dispatch({type: UNLOCK, payload: mk});
      dispatch({type: INIT_ACCOUNTS, payload: accounts.list});
    }
    console.log(INIT_ACCOUNTS);
  } catch (e) {
    console.log(e);
  }
};

export const lock = () => {
  return {type: LOCK};
};

export const forgetAccounts = () => ({type: UPDATE_ACCOUNT_ENC, payload: null});
