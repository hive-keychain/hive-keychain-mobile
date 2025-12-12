import globalPropertiesReducer from '../globalProperties';
import {GLOBAL_PROPS} from 'actions/types';
import {DynamicGlobalProperties} from '@hiveio/dhive';
import {GlobalProperties} from 'actions/interfaces';

describe('globalProperties reducer', () => {
  const initialState: GlobalProperties = {};

  it('should return initial state', () => {
    expect(globalPropertiesReducer(undefined, {type: 'UNKNOWN'})).toEqual({});
  });

  it('should handle GLOBAL_PROPS', () => {
    const props: GlobalProperties = {
      globals: {
        total_vesting_fund_hive: '1000000',
        total_vesting_shares: '2000000',
      } as DynamicGlobalProperties,
    };
    const action = {
      type: GLOBAL_PROPS,
      payload: props,
    };
    const result = globalPropertiesReducer(initialState, action);
    expect(result).toEqual(props);
  });

  it('should replace entire properties object', () => {
    const oldProps: GlobalProperties = {
      globals: {
        total_vesting_fund_hive: '1000000',
      } as DynamicGlobalProperties,
    };
    const newProps: GlobalProperties = {
      globals: {
        total_vesting_fund_hive: '2000000',
        total_vesting_shares: '3000000',
      } as DynamicGlobalProperties,
    };
    const state = globalPropertiesReducer(initialState, {
      type: GLOBAL_PROPS,
      payload: oldProps,
    });
    const result = globalPropertiesReducer(state, {
      type: GLOBAL_PROPS,
      payload: newProps,
    });
    expect(result).toEqual(newProps);
  });

  it('should return state unchanged for unknown action', () => {
    const state: GlobalProperties = {
      globals: {} as DynamicGlobalProperties,
    };
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = globalPropertiesReducer(state, action);
    expect(result).toEqual(state);
  });
});
















