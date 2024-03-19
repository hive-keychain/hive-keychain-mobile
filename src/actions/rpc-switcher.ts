import {Rpc} from './interfaces';
import {SET_DISPLAY_SWITCH_RPC, SET_SWITCH_TO_RPC} from './types';

export const setSwitchToRpc = (rpc: Rpc) => {
  return {
    type: SET_SWITCH_TO_RPC,
    payload: rpc,
  };
};

export const setDisplayChangeRpcPopup = (display: boolean) => {
  return {
    type: SET_DISPLAY_SWITCH_RPC,
    payload: display,
  };
};
