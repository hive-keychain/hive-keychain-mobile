import {ActionPayload, Rpc, SettingsPayload} from './interfaces';
import {
  SET_HIVE_ACCOUNT_HISTORY_RPC,
  SET_HIVE_ENGINE_RPC,
  SET_RPC,
} from './types';

export const setRpc = (rpc: Rpc) => {
  console.log('setRpc', rpc);
  const action: ActionPayload<SettingsPayload> = {
    type: SET_RPC,
    payload: {rpc},
  };
  return action;
};

export const setHiveEngineRpc = (hiveEngineRpc: string) => {
  const action: ActionPayload<SettingsPayload> = {
    type: SET_HIVE_ENGINE_RPC,
    payload: {hiveEngineRpc},
  };
  return action;
};

export const setAccountHistoryRpc = (accountHistoryAPIRpc: string) => {
  const action: ActionPayload<SettingsPayload> = {
    type: SET_HIVE_ACCOUNT_HISTORY_RPC,
    payload: {accountHistoryAPIRpc},
  };
  return action;
};
