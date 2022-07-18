import {Operation} from '@hiveio/dhive';
import {HiveURIActionTypes} from './types';

export const saveRequestedOperation = (operation: Operation) => {
  return {
    type: HiveURIActionTypes.SAVE_OPERATION,
    payload: operation,
  };
};

export const forgetRequestedOperation = () => {
  return {
    type: HiveURIActionTypes.FORGET_OPERATION,
  };
};
