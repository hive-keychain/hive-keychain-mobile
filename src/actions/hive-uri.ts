import {DecodeResult} from 'hive-uri';
import {VscOperation} from 'src/interfaces/vsc.interface';
import {HiveURIActionTypes} from './types';

export const saveRequestedOperation = (
  operation: DecodeResult | VscOperation,
) => {
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
