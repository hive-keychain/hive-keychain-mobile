import {HAS_Actions} from 'actions/types';
import {HAS_Token} from 'utils/hiveAuthenticationService/has.types';
import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';

export type HAS_Connect = {
  type: HAS_Actions.REQUEST;
  payload: HAS_ConnectPayload;
};

export type HAS_Treated = {
  type: HAS_Actions.REQUEST_TREATED;
  payload: string;
};

export type HAS_AddToken = {
  type: HAS_Actions.ADD_TOKEN;
  payload: {uuid: string; token: HAS_Token};
};

export type HAS_AddServerKey = {
  type: HAS_Actions.ADD_SERVER_KEY;
  payload: {host: string; server_key: string};
};
