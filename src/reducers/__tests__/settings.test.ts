import settingsReducer from '../settings';
import {
  SET_RPC,
  SET_HIVE_ENGINE_RPC,
  SET_HIVE_ACCOUNT_HISTORY_RPC,
  SET_MOBILE_SETTINGS,
} from 'actions/types';
import {DEFAULT_RPC} from 'lists/rpc.list';
import {
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_HE_RPC_NODE,
} from 'src/interfaces/hiveEngineRpc.interface';

describe('settings reducer', () => {
  const initialState = {
    rpc: DEFAULT_RPC,
    hiveEngineRpc: DEFAULT_HE_RPC_NODE,
    accountHistoryAPIRpc: DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
    mobileSettings: {
      platformRelevantFeatures: {
        swap: ['android'],
        externalOnboarding: ['android'],
      },
    },
  };

  it('should return initial state', () => {
    expect(settingsReducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('should handle SET_RPC', () => {
    const newRpc = 'https://api.hive.blog';
    const action = {
      type: SET_RPC,
      payload: {rpc: newRpc},
    };
    const result = settingsReducer(initialState, action);
    expect(result.rpc).toBe(newRpc);
    expect(result.hiveEngineRpc).toBe(initialState.hiveEngineRpc);
  });

  it('should handle SET_HIVE_ENGINE_RPC', () => {
    const newRpc = 'https://api.hive-engine.com';
    const action = {
      type: SET_HIVE_ENGINE_RPC,
      payload: {hiveEngineRpc: newRpc},
    };
    const result = settingsReducer(initialState, action);
    expect(result.hiveEngineRpc).toBe(newRpc);
    expect(result.rpc).toBe(initialState.rpc);
  });

  it('should handle SET_HIVE_ACCOUNT_HISTORY_RPC', () => {
    const newRpc = 'https://api.hive.blog';
    const action = {
      type: SET_HIVE_ACCOUNT_HISTORY_RPC,
      payload: {accountHistoryAPIRpc: newRpc},
    };
    const result = settingsReducer(initialState, action);
    expect(result.accountHistoryAPIRpc).toBe(newRpc);
  });

  it('should handle SET_MOBILE_SETTINGS', () => {
    const newSettings = {
      platformRelevantFeatures: {
        swap: ['ios'],
        externalOnboarding: ['ios'],
      },
    };
    const action = {
      type: SET_MOBILE_SETTINGS,
      payload: {mobileSettings: newSettings},
    };
    const result = settingsReducer(initialState, action);
    expect(result.mobileSettings).toEqual(newSettings);
  });

  it('should return state unchanged for unknown action', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = settingsReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});












