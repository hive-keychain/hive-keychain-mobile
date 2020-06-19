import {SIGN_UP, ADD_ACCOUNT, UPDATE_ACCOUNT_ENC} from './types';
import {encryptJson} from '../utils/encrypt';
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

export const unlock = () => {};

export const forgetAccounts = () => ({type: UPDATE_ACCOUNT_ENC, payload: null});
