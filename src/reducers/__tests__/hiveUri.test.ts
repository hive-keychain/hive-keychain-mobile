import hiveUriReducer from '../hiveUri';
import {HiveURIActionTypes} from 'actions/types';
import {DecodeResult} from 'hive-uri';
import {HiveUriOpType} from 'utils/hiveUri.utils';

describe('hiveUri reducer', () => {
  const initialState = {};

  it('should return initial state', () => {
    expect(hiveUriReducer(undefined, {type: 'UNKNOWN'})).toEqual({});
  });

  it('should handle SAVE_OPERATION', () => {
    const operation: DecodeResult = {
      protocol: 'hive',
      domain: 'example.com',
      action: 'transfer',
      params: {to: 'user1', amount: '100 HIVE'},
    } as DecodeResult;
    const opType: HiveUriOpType = 'transfer';
    const action = {
      type: HiveURIActionTypes.SAVE_OPERATION,
      payload: {operation, opType},
    };
    const result = hiveUriReducer(initialState, action);
    expect(result.operation).toEqual(operation);
    expect(result.opType).toBe(opType);
  });

  it('should handle FORGET_OPERATION', () => {
    const state = {
      operation: {
        protocol: 'hive',
        action: 'transfer',
      } as DecodeResult,
      opType: 'transfer' as HiveUriOpType,
    };
    const action = {
      type: HiveURIActionTypes.FORGET_OPERATION,
      payload: undefined,
    };
    const result = hiveUriReducer(state, action);
    expect(result).toEqual({});
  });

  it('should return state unchanged for unknown action', () => {
    const state = {
      operation: {} as DecodeResult,
      opType: 'transfer' as HiveUriOpType,
    };
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: undefined,
    };
    const result = hiveUriReducer(state, action);
    expect(result).toEqual(state);
  });
});















