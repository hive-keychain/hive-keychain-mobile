import rpcSwitcherReducer from '../rpcSwitcher';
import {SET_SWITCH_TO_RPC, SET_DISPLAY_SWITCH_RPC} from 'actions/types';
import {Rpc} from 'actions/interfaces';

describe('rpcSwitcher reducer', () => {
  const initialState = {display: false};

  it('should return initial state', () => {
    expect(rpcSwitcherReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle SET_SWITCH_TO_RPC', () => {
    const rpc: Rpc = {
      uri: 'https://api.hive.blog',
      testnet: false,
    } as Rpc;
    const action = {
      type: SET_SWITCH_TO_RPC,
      payload: rpc,
    };
    const result = rpcSwitcherReducer(initialState, action);
    expect(result.rpc).toEqual(rpc);
    expect(result.display).toBe(false);
  });

  it('should handle SET_DISPLAY_SWITCH_RPC', () => {
    const action = {
      type: SET_DISPLAY_SWITCH_RPC,
      payload: true,
    };
    const result = rpcSwitcherReducer(initialState, action);
    expect(result.display).toBe(true);
  });

  it('should handle SET_DISPLAY_SWITCH_RPC with false', () => {
    const state = {display: true};
    const action = {
      type: SET_DISPLAY_SWITCH_RPC,
      payload: false,
    };
    const result = rpcSwitcherReducer(state, action);
    expect(result.display).toBe(false);
  });

  it('should return state unchanged for unknown action', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = rpcSwitcherReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});










