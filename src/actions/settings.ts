import KeychainApi from 'api/keychain';
import {AppThunk} from 'hooks/redux';
import {
  ActionPayload,
  MobileSettings,
  Rpc,
  SettingsPayload,
} from './interfaces';
import {
  SET_HIVE_ACCOUNT_HISTORY_RPC,
  SET_HIVE_ENGINE_RPC,
  SET_MOBILE_SETTINGS,
  SET_RPC,
} from './types';
export const setRpc = (rpc: Rpc) => {
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

export const getSettings = (): AppThunk => async (dispatch) => {
  const mobileSettings: MobileSettings = (
    await KeychainApi.get('mobile-settings')
  ).data;
  const action: ActionPayload<SettingsPayload> = {
    type: SET_MOBILE_SETTINGS,
    payload: {mobileSettings},
  };
  dispatch(action);
};
