import {HAS_Token} from 'utils/hiveAuthenticationService/has.types';
import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {KeychainRequestTypes} from 'utils/keychain.types';
import {HAS_ActionsTypes} from './types';

export const treatHASRequest = (data: HAS_ConnectPayload & {key: string}) => {
  data.auth_key = data.key;
  delete data.key;
  return {
    type: HAS_ActionsTypes.REQUEST,
    payload: data,
  };
};

export const showHASInitRequestAsTreated = (host: string) => {
  return {
    type: HAS_ActionsTypes.REQUEST_TREATED,
    payload: host,
  };
};

export const addSessionToken = (uuid: string, token: HAS_Token) => {
  return {type: HAS_ActionsTypes.ADD_TOKEN, payload: {uuid, token}};
};

export const addServerKey = (host: string, server_key: string) => {
  return {
    type: HAS_ActionsTypes.ADD_SERVER_KEY,
    payload: {host, server_key},
  };
};

export const addServerVersion = (host: string, version: string) => {
  return {
    type: HAS_ActionsTypes.ADD_SERVER_VERSION,
    payload: {host, version},
  };
};

export const updateInstanceConnectionStatus = (
  host: string,
  connected: boolean,
) => {
  return {
    type: HAS_ActionsTypes.UPDATE_INSTANCE_CONNECTION_STATUS,
    payload: {host, connected},
  };
};

export const clearHASState = () => {
  return {
    type: HAS_ActionsTypes.CLEAR,
  };
};

export const removeHASSession = (uuid: string) => {
  return {
    type: HAS_ActionsTypes.REMOVE_SESSION,
    payload: {uuid},
  };
};

export const addWhitelistedOperationToSession = (
  uuid: string,
  operation: KeychainRequestTypes,
) => {
  return {
    type: HAS_ActionsTypes.ADD_WHITELISTED_OPERATION,
    payload: {uuid, operation},
  };
};

export const updateNonce = (uuid: string, nonce: number) => {
  return {
    type: HAS_ActionsTypes.UPDATE_NONCE,
    payload: {uuid, nonce},
  };
};
