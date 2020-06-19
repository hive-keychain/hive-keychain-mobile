import {SIGN_UP, ADD_ACCOUNT} from './types';
import {navigate} from '../navigationRef';

export const signUp = (pwd) => {
  console.log('navigate out');
  navigate('AddAccountScreen');
  return {type: SIGN_UP, payload: pwd};
};

export const addAccount = (name, keys) => {
  console.log(name, keys);
  return {type: ADD_ACCOUNT, payload: {name, keys}};
};

export const getAccounts = () => {};
