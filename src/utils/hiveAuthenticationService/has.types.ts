import {KeychainRequestTypes} from 'utils/keychain.types';

// One HAS_Instance per different domain serving HAS being used
export type HAS_Instance = {
  host: string;
  server_key?: string;
  init: boolean;
  connected?: boolean;
  version?: string;
};

// One HAS_connection per qr code scan / deep linking
export type HAS_Session = {
  uuid: string; // UUID passed via QR / DL
  auth_key: string; // secret key passed via QR / DL
  token?: HAS_Token;
  account: string;
  host: string;
  init: boolean;
  whitelist: KeychainRequestTypes[];
  nonce?: number;
};

export type HAS_Token = {
  app: string;
  token: string;
  expiration: number;
  ts_create?: string;
  ts_expire?: string;
};

// TODO: ask server key at each connection
// reauth the users

////////////////////////

// // One HAS_Instance per different domain serving HAS being used
// export type HAS_Instance = {
//   host: string;
//   server_key?: string;
//   connections: HAS_Connection[];
// };

// // One HAS_connection per qr code scan / deep linking
// export type HAS_Connection = {
//   app: string; // TBD : a given connection is only attached to one app, right ? (i.e: PeakD) YES
//   // TBD : when can i invalidate a connection and all its tokens?
//   uuid: string; // UUID passed via QR / DL
//   key: string; // secret key passed via QR / DL
//   tokens: HAS_Token[];
// };

// // Tokens created by a connection
// export type HAS_Token = {
//   account: string; // TBD : can we actually have several accounts registered through the
//   // same connection? If not, move account to HAS_Connection. Potentially yes.
//   token: string; // TBD : if we can have more than one account per connection,
//   // do different accounts share the same tokens, or to each its own?
//   expire: number;
//   app: string;
// };

//////////////////////////////
