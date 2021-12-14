import {HAS_Token} from 'utils/hiveAuthenticationService/has.types';
import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {HAS_Actions} from './types';

export const treatHASRequest = (data: HAS_ConnectPayload & {key: string}) => {
  data.auth_key = data.key;
  delete data.key;
  return {
    type: HAS_Actions.REQUEST,
    payload: data,
  };
};

export const showHASInitRequestAsTreated = (host: string) => {
  return {
    type: HAS_Actions.REQUEST_TREATED,
    payload: host,
  };
};

export const addSessionToken = (uuid: string, token: HAS_Token) => {
  return {type: HAS_Actions.ADD_TOKEN, payload: {uuid, token}};
};

export const addServerKey = (host: string, server_key: string) => {
  return {
    type: HAS_Actions.ADD_SERVER_KEY,
    payload: {host, server_key},
  };
};
