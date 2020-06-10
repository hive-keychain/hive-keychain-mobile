import {SIGN_UP} from './types';
import {navigate} from '../navigationRef';

export const signUp = (pwd) => {
  console.log('navigate out');
  navigate('AddAccountScreen');
  return {type: SIGN_UP, payload: pwd};
};
