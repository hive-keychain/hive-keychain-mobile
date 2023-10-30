import {ActionPayload, SettingsPayload} from './interfaces';
import {SET_RPC} from './types';

export const setRpc = (rpc: string) => {
  console.log({rpc}); //TODO rmeove line
  const action: ActionPayload<SettingsPayload> = {
    type: SET_RPC,
    payload: {rpc},
  };
  return action;
};
