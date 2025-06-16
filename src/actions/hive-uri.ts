import {DecodeResult} from 'hive-uri';
import {HiveURIActionTypes} from './types';

export const saveRequestedOperation = (operation: DecodeResult) => {
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
