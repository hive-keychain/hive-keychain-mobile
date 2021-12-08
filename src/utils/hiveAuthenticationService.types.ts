import {Operation} from '@hiveio/dhive';
import {KeyTypes} from 'actions/interfaces';
import {KeychainRequest, RequestSuccess} from './keychain.types';

export type HAS_ConnectPayload = {
  account: string;
  uuid: string;
  host: string;
  key: string;
};

export type HAS_AuhtDecryptedData = {
  app: {
    name: string;
    icon: string;
    description: string;
    pubkey: string;
  };
};

export type HAS_AuthPayload = {
  cmd: 'auth_req';
  account: string;
  decryptedData?: HAS_AuhtDecryptedData;
  auth_key: string;
  data: string;
  uuid: string;
  expire: number;
};

export type HAS_BroadcastPayload = {
  cmd: 'sign_req';
  account: string;
  token: string;
  data: string;
  decryptedData?: HAS_OpsData;
  uuid: string;
  expire: number;
};

export type HAS_Connected = {
  cmd: 'connected';
};

export type HAS_Error = {
  cmd: 'error';
};

export type HAS_Register = {
  cmd: 'register_ack';
};

export type HAS_KeyAck = {
  cmd: 'key_ack';
  key: string;
};
export type HAS_ChallengeReq = {
  cmd: 'challenge_req';
  account: string;
  token: string;
  data: string;
  decrypted_data?: {key_type: string; challenge: string};
  uuid: string;
};

export type HAS_Type =
  | HAS_AuthPayload
  | HAS_BroadcastPayload
  | HAS_Connected
  | HAS_Error
  | HAS_Register
  | HAS_KeyAck
  | HAS_ChallengeReq;

export type Token = {
  token: string;
  expire: number;
  app: string;
  ts_create: string;
  ts_expire: string;
};

export type Connection = {
  account: string;
  uuid: string;
  key: string;
  tokens: Token[];
};

export type HAS_OpsData = {
  key_type: KeyTypes;
  ops: Operation[];
  broadcast: boolean;
};

export type HAS_BroadcastModalPayload = {
  request: KeychainRequest;
  accounts: any;
  onForceCloseModal: () => void;
  sendError: () => void;
  sendResponse: (obj: RequestSuccess) => void;
};

export type HAS_AuthChallengeData = {
  token: string;
  expire: number;
  challenge?: string;
};
