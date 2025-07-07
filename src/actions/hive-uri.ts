import {DecodeResult} from 'hive-uri';
import {HiveUriOpType} from 'src/utils/hive-uri';
import {HiveURIActionTypes} from './types';

export const saveRequestedOperation = (
  opType: HiveUriOpType,
  operation: DecodeResult,
) => {
  return {
    type: HiveURIActionTypes.SAVE_OPERATION,
    payload: {opType, operation},
  };
};

export const forgetRequestedOperation = () => {
  return {
    type: HiveURIActionTypes.FORGET_OPERATION,
  };
};
