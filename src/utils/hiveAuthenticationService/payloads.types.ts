/* istanbul ignore file */
import {Operation} from '@hiveio/dhive';
import {KeyTypes} from 'actions/interfaces';
import {
  KeychainRequest,
  RequestError,
  RequestSuccess,
} from 'utils/keychain.types';

export enum HAS_PayloadType {
  AUTH = 'auth_req',
  SIGN = 'sign_req',
  CHALLENGE = 'challenge_req',
  ERROR = 'error',
  CONNECTED = 'connected',
  REGISTER = 'register_ack',
  KEY_ACK = 'key_ack',
}
// Connection
export type HAS_ConnectPayload = {
  account: string;
  uuid: string;
  host: string;
  auth_key: string;
};

// Authentication

export type HAS_AuthPayload = {
  cmd: HAS_PayloadType.AUTH;
  account: string;
  decryptedData?: HAS_AuthDecrypted;
  token?: string;
  data: string;
  uuid: string;
  expire: number;
};

export type HAS_AuthDecrypted = {
  app: {
    name: string;
    icon: string;
    description: string;
    pubkey: string;
  };
  challenge: HAS_ChallengeDecryptedData;
};

// Challenge
export type HAS_ChallengePayload = {
  cmd: HAS_PayloadType.CHALLENGE;
  account: string;
  token: string;
  data: string;
  decrypted_data?: HAS_ChallengeDecryptedData;
  uuid: string;
};

export type HAS_ChallengeDecryptedData = {key_type: string; challenge: string};
// Sign transaction

export type HAS_SignPayload = {
  cmd: HAS_PayloadType.SIGN;
  account: string;
  token: string;
  data: string;
  decryptedData?: HAS_SignDecrypted;
  uuid: string;
  expire: number;
};

export type HAS_SignDecrypted = {
  key_type: KeyTypes;
  ops: Operation[];
  broadcast: boolean;
};

export type HAS_BroadcastModalPayload = {
  request: KeychainRequest;
  accounts: any;
  onForceCloseModal: () => void;
  sendError: (obj: RequestError) => void;
  sendResponse: (obj: RequestSuccess, keep: boolean) => void;
  expiration: number;
};

export type HAS_AuthChallengeData = {
  token: string;
  expire: number;
  challenge?: {pubkey: string; challenge: string} | string;
};

// Others
export type HAS_ConnectedPayload = {
  cmd: HAS_PayloadType.CONNECTED;
};

export type HAS_ErrorPayload = {
  cmd: HAS_PayloadType.ERROR;
};

export type HAS_RegisterPayload = {
  cmd: HAS_PayloadType.REGISTER;
  account: string;
};

export type HAS_KeyAckPayload = {
  cmd: HAS_PayloadType.KEY_ACK;
  key: string;
};

// HAS Payload Union
export type HAS_Payload =
  | HAS_AuthPayload
  | HAS_SignPayload
  | HAS_ConnectedPayload
  | HAS_ErrorPayload
  | HAS_RegisterPayload
  | HAS_KeyAckPayload
  | HAS_ChallengePayload;
