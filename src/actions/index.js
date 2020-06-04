import {SIGN_UP} from './types';

export const signUp = (pwd) => {
  return {type: SIGN_UP, payload: pwd};
};
