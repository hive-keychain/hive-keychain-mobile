import {HAS_ActionsTypes} from 'actions/types';
import {HAS_Token} from 'utils/hiveAuthenticationService/has.types';
import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {KeychainRequestTypes} from 'utils/keychain.types';

export type HAS_Connect = {
  type: HAS_ActionsTypes.REQUEST;
  payload: HAS_ConnectPayload;
};

export type HAS_Treated = {
  type: HAS_ActionsTypes.REQUEST_TREATED;
  payload: string;
};

export type HAS_AddToken = {
  type: HAS_ActionsTypes.ADD_TOKEN;
  payload: {uuid: string; token: HAS_Token};
};

export type HAS_AddServerKey = {
  type: HAS_ActionsTypes.ADD_SERVER_KEY;
  payload: {host: string; server_key: string};
};

export type HAS_Clear = {
  type: HAS_ActionsTypes.CLEAR;
};

export type HAS_UpdateInstanceConnectionStatus = {
  type: HAS_ActionsTypes.UPDATE_INSTANCE_CONNECTION_STATUS;
  payload: {host: string; connected: boolean};
};

export type HAS_RemoveSession = {
  type: HAS_ActionsTypes.REMOVE_SESSION;
  payload: {uuid: string};
};

export type HAS_AddWhitelistedOperation = {
  type: HAS_ActionsTypes.ADD_WHITELISTED_OPERATION;
  payload: {uuid: string; operation: KeychainRequestTypes};
};

export type HAS_Actions =
  | HAS_Connect
  | HAS_Treated
  | HAS_AddToken
  | HAS_AddServerKey
  | HAS_Clear
  | HAS_UpdateInstanceConnectionStatus
  | HAS_RemoveSession
  | HAS_AddWhitelistedOperation;
