import {actionPayload, settingsPayload} from './interfaces';
import {SET_RPC} from './types';

export const setRpc = (rpc: string) => {
  const action: actionPayload<settingsPayload> = {
    type: SET_RPC,
    payload: {rpc},
  };
  return action;
};
