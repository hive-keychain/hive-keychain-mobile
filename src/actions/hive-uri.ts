import {Operation} from '@hiveio/dhive';
import {VscOperation} from 'src/interfaces/vsc.interface';
import {HiveURIActionTypes} from './types';

export const saveRequestedOperation = (operation: Operation | VscOperation) => {
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
