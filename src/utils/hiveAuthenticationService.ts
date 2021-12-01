import {CommentOperation, VoteOperation} from '@hiveio/dhive';
import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import {encodeMemo} from 'components/bridge';
import Crypto from 'crypto-js';
import uuid from 'react-native-uuid';
import {RootState, store} from 'store';
import {
  Connection,
  HAS_AuhtDecryptedData,
  HAS_AuthChallengeData,
  HAS_AuthPayload,
  HAS_BroadcastModalPayload,
  HAS_BroadcastPayload,
  HAS_ConnectPayload,
  HAS_OpsData,
  HAS_Type,
} from './hiveAuthenticationService.types';
import {
  KeychainKeyTypes,
  KeychainRequestTypes,
  RequestBroadcast,
  RequestPost,
  RequestSuccess,
  RequestVote,
} from './keychain.types';
import {ModalComponent} from './modal.enum';
import {navigate} from './navigation';

export const showHASInitRequest = (data: any) => {
  store.dispatch(showHASInitRequestAsTreated());
  navigate('ModalScreen', {
    name: ModalComponent.HAS_INIT,
    data: data.data,
  });
};

let has: HAS[] = [];

export const getHAS = (host: string) => {
  const existing_has = has.find((e) => e.host === host);
  if (!existing_has) {
    const new_HAS = new HAS(host);
    has.push(new_HAS);
    return new_HAS;
  } else return existing_has;
};

class HAS {
  ws: WebSocket = null;
  host: string = null;
  server_key: string = null;
  connections: Connection[] = [];
  awaiting_registration: string[] = [];

  constructor(host: string) {
    this.host = host;
    this.ws = new WebSocket(host);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
  }

  connect = (data: HAS_ConnectPayload) => {
    console.log(`UUID: ${data.uuid}`);
    this.connections.push({
      key: data.key,
      account: data.account,
      uuid: data.uuid,
      tokens: [],
    });
    if (this.server_key) {
      this.registerAccounts([data.account]);
    } else {
      this.awaiting_registration.push(data.account);
    }
  };

  onOpen = () => {
    console.log('Connection established');
    this.send(JSON.stringify({cmd: 'key_req'}));
  };

  onMessage = async (event: WebSocketMessageEvent) => {
    console.log(`[RECV] ${event.data}`);
    try {
      const payload: HAS_Type =
        typeof event.data == 'string' ? JSON.parse(event.data) : event.data;
      if (!payload.cmd || typeof payload.cmd !== 'string') {
        throw new Error(`invalid payload (cmd)`);
      }
      switch (payload.cmd) {
        // Process HAS <-> PKSA protocol
        case 'connected':
          // connection confirmation from the HAS
          //console.log('HAS confirm connection', payload);
          return;
        case 'error':
          // error from the HAS
          console.log('HAS error', payload);
          return;
        case 'register_ack':
          // registration confirmation from the HAS
          console.log('HAS register_ack', payload);
          return;
        case 'key_ack':
          // server public key received
          this.server_key = payload.key;
          console.log('HAS key ack ', this.server_key);
          if (this.awaiting_registration.length) {
            this.registerAccounts(this.awaiting_registration);
          }
          break;
        case 'auth_req':
          this.checkPayload(payload);
          const accountConnection = this.connections.find(
            (e) => e.account === payload.account && e.uuid === payload.uuid,
          );
          assert(
            accountConnection,
            'This account has not been connected through HAS.',
          );

          const data: HAS_AuhtDecryptedData = JSON.parse(
            Crypto.AES.decrypt(payload.data, accountConnection.key).toString(
              Crypto.enc.Utf8,
            ),
          );
          payload.decryptedData = data;
          console.log(payload);

          navigate('ModalScreen', {
            name: ModalComponent.HAS_AUTH,
            data: {...payload, callback: this.answerAuthReq},
          });
          break;

        case 'sign_req':
          try {
            this.checkPayload(payload);

            const account = this.connections.find(
              (e) => e.account === payload.account,
            );
            assert(account, 'This account has not been connected through HAS.');
            console.log(account.tokens);
            const auth = account.tokens.find(
              (o) => o.token === payload.token && o.expire > Date.now(),
            );
            assert(auth, 'Token invalid or expired');
            // Decrypt the ops to sign with the encryption key associated to the token.
            const opsData: HAS_OpsData = JSON.parse(
              Crypto.AES.decrypt(payload.data, account.key).toString(
                Crypto.enc.Utf8,
              ),
            );
            const {ops, key_type} = opsData;
            payload.decryptedData = opsData;
            let request;
            if (ops.length === 1) {
              let op = ops[0];
              switch (op[0]) {
                case 'vote':
                  const voteOperation = (op as VoteOperation)[1];
                  request = {
                    domain: auth.app,
                    type: KeychainRequestTypes.vote,
                    username: payload.account,
                    permlink: voteOperation.permlink,
                    author: voteOperation.author,
                    weight: voteOperation.weight,
                  } as RequestVote;
                  break;
                case 'comment':
                  const commentOperation = (op as CommentOperation)[1];
                  request = {
                    domain: auth.app,
                    type: KeychainRequestTypes.post,
                    username: payload.account,
                    permlink: commentOperation.permlink,
                    title: commentOperation.title,
                    body: commentOperation.body,
                    parent_perm: commentOperation.parent_permlink,
                    parent_username: commentOperation.parent_author,
                    json_metadata: commentOperation.json_metadata,
                  } as RequestPost;
                  break;
                default:
                  request = {
                    domain: auth.app,
                    type: KeychainRequestTypes.broadcast,
                    username: payload.account,
                    operations: ops,
                    method: KeychainKeyTypes[key_type],
                  } as RequestBroadcast;
                  break;
              }
            } else {
              request = {
                domain: auth.app,
                type: KeychainRequestTypes.broadcast,
                username: payload.account,
                operations: ops,
                method: KeychainKeyTypes[key_type],
              } as RequestBroadcast;
            }
            const data: HAS_BroadcastModalPayload = {
              request: {...request, has: true},
              accounts: await store.getState().accounts,
              onForceCloseModal: () => {},
              sendError: () => {
                this.answerFailedBroadcastReq(payload);
              },
              sendResponse: (obj: RequestSuccess) => {
                this.answerSuccessfulBroadcastReq(payload, obj);
              },
            };

            navigate('ModalScreen', {
              name: ModalComponent.HAS_BROADCAST,
              data,
            });
          } catch (e) {
            console.log(e);
            // this.send(
            //   JSON.stringify({
            //     cmd: 'sign_err',
            //     uuid: payload.uuid,
            //     error: e.message,
            //   }),
            // );
          }
          break;
        default:
          throw new Error('Invalid payload (unknown cmd)');
      }
    } catch (e) {
      console.log(e);
      //TODO: Think about how to handle this
      //this.send(JSON.stringify({cmd: 'error', error: (e as any).message}));
    }
    console.debug('message processed');
  };

  registerAccounts = async (acc: string[]) => {
    const accounts = [];
    for (const account of acc) {
      accounts.push(
        await prepareChallengeRequest(
          account,
          this.server_key,
          `${Date.now()}`,
        ),
      );
    }
    const request = {
      cmd: 'register_req',
      app: 'Hive Keychain',
      accounts,
    };
    this.send(JSON.stringify(request));
  };

  checkPayload = (payload: HAS_BroadcastPayload | HAS_AuthPayload) => {
    if (payload.uuid) {
      // validate APP request forwarded by HAS
      assert(
        payload.uuid && typeof payload.uuid == 'string',
        `invalid payload (uuid)`,
      );
      assert(
        payload.expire && typeof payload.expire == 'number',
        `invalid payload (expire)`,
      );
      assert(
        payload.account && typeof payload.account == 'string',
        `invalid payload (account)`,
      );
      assert(
        Date.now() < payload.expire,
        `request expired - now:${Date.now()} > expire:${payload.expire}}`,
      );
    }
  };

  answerAuthReq = async (
    payload: HAS_AuthPayload,
    approve: boolean,
    callback: () => void,
  ) => {
    try {
      // NOTE: The default expiration time for a token is 24 hours - It can be set to a longer duration for "service" APPS
      const EXPIRE_DELAY_APP = 24 * 60 * 60 * 1000;
      // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
      //       Secure PKSA should read it from the QR code scanned by the user
      const connection = this.connections.find((e) => e.uuid === payload.uuid);
      const app_key = connection.key;

      if (approve) {
        const token = uuid.v4() as string;
        const expire = Date.now() + EXPIRE_DELAY_APP;
        const auth_ack_data: HAS_AuthChallengeData = {
          token: token,
          expire: expire,
        };
        console.log('before dec');
        if (payload.decryptedData.app.pubkey) {
          auth_ack_data.challenge = await dAppChallenge(
            payload.account,
            payload.decryptedData.app.pubkey,
            payload.account,
          );
        }
        console.log('after dec', auth_ack_data);
        //const challenge = Crypto.AES.encrypt(payload.uuid, app_key).toString();
        const data = Crypto.AES.encrypt(
          JSON.stringify(auth_ack_data),
          app_key,
        ).toString();
        this.send(
          JSON.stringify({
            cmd: 'auth_ack',
            uuid: payload.uuid,
            data,
            //challenge: challenge,
          }),
        );
        // Add new token into storage
        connection.tokens.push({
          token: token,
          expire: expire,
          app: payload.decryptedData.app.name,
          ts_create: new Date().toISOString(),
          ts_expire: new Date(expire).toISOString(),
        });
      } else {
        this.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
      }
      callback();
      // remove expired tokens
      connection.tokens = connection.tokens.filter(
        (o) => o.expire > Date.now(),
      );
    } catch (e) {
      console.log(e);
      this.send(
        JSON.stringify({
          cmd: 'auth_err',
          uuid: payload.uuid,
          error: 'Request canceled by user',
        }),
      );
    }
  };

  answerSuccessfulBroadcastReq = (
    payload: HAS_BroadcastPayload,
    result: any,
  ) => {
    console.log(payload);
    if (payload.decryptedData.broadcast) {
      this.send(
        JSON.stringify({
          cmd: 'sign_ack',
          uuid: payload.uuid,
          broadcast: payload.decryptedData.broadcast,
          data: result.id,
        }),
      );
    } else {
      throw new Error('Transaction signing not implemented');
      //                 const tx = new Transaction
      //                 tx.ops = ops
      // //                const signed_tx = await hiveClient.broadcast.sign(tx, PrivateKey.from(key_private))
      //                 this.send(JSON.stringify({cmd:"sign_ack", uuid:uuid, broadcast:payload.broadcast, data:"signed_tx"}))
    }
  };

  answerFailedBroadcastReq = (payload: HAS_BroadcastPayload) => {
    this.send(JSON.stringify({cmd: 'sign_nack', uuid: payload.uuid}));
  };

  send = (message: string) => {
    console.log(`[SEND] ${message}`);
    this.ws.send(message);
  };
}

const dAppChallenge = async (
  username: string,
  pubkey: string,
  message: string,
) => {
  try {
    const accounts = (store.getState() as RootState).accounts;
    const account = accounts.find((e) => e.name === username);
    if (!account) return null;
    const key = account.keys.posting;
    if (!key)
      //TODO : throw error;
      return null;
    return await encodeMemo(key, pubkey, `#${message}`);
  } catch (e) {
    console.log('error encrypting', e);
  }
};

const prepareChallengeRequest = async (
  username: string,
  serverKey: string,
  message: string,
) => {
  try {
    const key = getLeastDangerousKey(username);
    console.log(key);
    return {
      key_type: key.type,
      challenge: await encodeMemo(key.value, serverKey, `#${message}`),
      name: username,
    };
  } catch (e) {
    console.log('memo', e);
  }
};

const getLeastDangerousKey = (username: string) => {
  const accounts = (store.getState() as RootState).accounts;
  const account = accounts.find((e) => e.name === username);
  if (!account) return null;
  else if (account.keys.memo) return {type: 'memo', value: account.keys.memo};
  else if (account.keys.memo)
    return {type: 'posting', value: account.keys.posting};
  else return {type: 'active', value: account.keys.active};
};

export default HAS;

// import {CommentOperation, VoteOperation} from '@hiveio/dhive';
// import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
// import assert from 'assert';
// import {encodeMemo} from 'components/bridge';
// import Crypto from 'crypto-js';
// import uuid from 'react-native-uuid';
// import {RootState, store} from 'store';
// import {
//   Connection,
//   HAS_AuhtDecryptedData,
//   HAS_AuthChallengeData,
//   HAS_AuthPayload,
//   HAS_BroadcastModalPayload,
//   HAS_BroadcastPayload,
//   HAS_ConnectPayload,
//   HAS_OpsData,
//   HAS_Type,
// } from './hiveAuthenticationService.types';
// import {
//   KeychainKeyTypes,
//   KeychainRequestTypes,
//   RequestBroadcast,
//   RequestPost,
//   RequestSuccess,
//   RequestVote,
// } from './keychain.types';
// import {ModalComponent} from './modal.enum';
// import {navigate} from './navigation';

// export const showHASInitRequest = (data: any) => {
//   store.dispatch(showHASInitRequestAsTreated());
//   navigate('ModalScreen', {
//     name: ModalComponent.HAS_INIT,
//     data: data.data,
//   });
// };

// let has: HAS = null;

// export const getHAS = (host: string) => {
//   if (!has) {
//     has = new HAS(host);
//   }
//   return has;
// };

// class HAS {
//   ws: WebSocket = null;
//   host: string = null;
//   server_key: string = null;
//   connections: Connection[] = [];
//   awaiting_registration: string[] = [];

//   constructor(host: string) {
//     this.host = host;
//     this.ws = new WebSocket(host);
//     this.ws.onopen = this.onOpen;
//     this.ws.onmessage = this.onMessage;
//   }

//   connect = (data: HAS_ConnectPayload) => {
//     console.log(`UUID: ${data.uuid}`);
//     this.connections.push({
//       key: data.key,
//       account: data.account,
//       uuid: data.uuid,
//       tokens: [],
//     });
//     if (this.server_key) {
//       this.registerAccounts([data.account]);
//     } else {
//       this.awaiting_registration.push(data.account);
//     }
//   };

//   onOpen = () => {
//     console.log('Connection established');
//     this.send(JSON.stringify({cmd: 'key_req'}));
//   };

//   onMessage = async (event: WebSocketMessageEvent) => {
//     console.log(`[RECV] ${event.data}`);
//     try {
//       const payload: HAS_Type =
//         typeof event.data == 'string' ? JSON.parse(event.data) : event.data;
//       if (!payload.cmd || typeof payload.cmd !== 'string') {
//         throw new Error(`invalid payload (cmd)`);
//       }
//       switch (payload.cmd) {
//         // Process HAS <-> PKSA protocol
//         case 'connected':
//           // connection confirmation from the HAS
//           //console.log('HAS confirm connection', payload);
//           return;
//         case 'error':
//           // error from the HAS
//           console.log('HAS error', payload);
//           return;
//         case 'register_ack':
//           // registration confirmation from the HAS
//           console.log('HAS register_ack', payload);
//           return;
//         case 'key_ack':
//           // server public key received
//           this.server_key = payload.key;
//           console.log('HAS key ack ', this.server_key);
//           if (this.awaiting_registration.length) {
//             this.registerAccounts(this.awaiting_registration);
//           }
//           break;
//         case 'auth_req':
//           this.checkPayload(payload);
//           const accountConnection = this.connections.find(
//             (e) => e.account === payload.account && e.uuid === payload.uuid,
//           );
//           assert(
//             accountConnection,
//             'This account has not been connected through HAS.',
//           );

//           const data: HAS_AuhtDecryptedData = JSON.parse(
//             Crypto.AES.decrypt(payload.data, accountConnection.key).toString(
//               Crypto.enc.Utf8,
//             ),
//           );
//           payload.decryptedData = data;
//           console.log(payload);

//           navigate('ModalScreen', {
//             name: ModalComponent.HAS_AUTH,
//             data: {...payload, callback: this.answerAuthReq},
//           });
//           break;

//         case 'sign_req':
//           try {
//             this.checkPayload(payload);

//             const account = this.connections.find(
//               (e) => e.account === payload.account,
//             );
//             assert(account, 'This account has not been connected through HAS.');
//             console.log(account.tokens);
//             const auth = account.tokens.find(
//               (o) => o.token === payload.token && o.expire > Date.now(),
//             );
//             assert(auth, 'Token invalid or expired');
//             // Decrypt the ops to sign with the encryption key associated to the token.
//             const opsData: HAS_OpsData = JSON.parse(
//               Crypto.AES.decrypt(payload.data, account.key).toString(
//                 Crypto.enc.Utf8,
//               ),
//             );
//             const {ops, key_type} = opsData;
//             payload.decryptedData = opsData;
//             let request;
//             if (ops.length === 1) {
//               let op = ops[0];
//               switch (op[0]) {
//                 case 'vote':
//                   const voteOperation = (op as VoteOperation)[1];
//                   request = {
//                     domain: auth.app,
//                     type: KeychainRequestTypes.vote,
//                     username: payload.account,
//                     permlink: voteOperation.permlink,
//                     author: voteOperation.author,
//                     weight: voteOperation.weight,
//                   } as RequestVote;
//                   break;
//                 case 'comment':
//                   const commentOperation = (op as CommentOperation)[1];
//                   request = {
//                     domain: auth.app,
//                     type: KeychainRequestTypes.post,
//                     username: payload.account,
//                     permlink: commentOperation.permlink,
//                     title: commentOperation.title,
//                     body: commentOperation.body,
//                     parent_perm: commentOperation.parent_permlink,
//                     parent_username: commentOperation.parent_author,
//                     json_metadata: commentOperation.json_metadata,
//                   } as RequestPost;
//                   break;
//                 default:
//                   request = {
//                     domain: auth.app,
//                     type: KeychainRequestTypes.broadcast,
//                     username: payload.account,
//                     operations: ops,
//                     method: KeychainKeyTypes[key_type],
//                   } as RequestBroadcast;
//                   break;
//               }
//             } else {
//               request = {
//                 domain: auth.app,
//                 type: KeychainRequestTypes.broadcast,
//                 username: payload.account,
//                 operations: ops,
//                 method: KeychainKeyTypes[key_type],
//               } as RequestBroadcast;
//             }
//             const data: HAS_BroadcastModalPayload = {
//               request: {...request, has: true},
//               accounts: await store.getState().accounts,
//               onForceCloseModal: () => {},
//               sendError: () => {
//                 this.answerFailedBroadcastReq(payload);
//               },
//               sendResponse: (obj: RequestSuccess) => {
//                 this.answerSuccessfulBroadcastReq(payload, obj);
//               },
//             };

//             navigate('ModalScreen', {
//               name: ModalComponent.HAS_BROADCAST,
//               data,
//             });
//           } catch (e) {
//             console.log(e);
//             // this.send(
//             //   JSON.stringify({
//             //     cmd: 'sign_err',
//             //     uuid: payload.uuid,
//             //     error: e.message,
//             //   }),
//             // );
//           }
//           break;
//         default:
//           throw new Error('Invalid payload (unknown cmd)');
//       }
//     } catch (e) {
//       console.log(e);
//       //TODO: Think about how to handle this
//       //this.send(JSON.stringify({cmd: 'error', error: (e as any).message}));
//     }
//     console.debug('message processed');
//   };

//   registerAccounts = async (acc: string[]) => {
//     const accounts = [];
//     for (const account of acc) {
//       accounts.push(
//         await prepareChallengeRequest(
//           account,
//           this.server_key,
//           `${Date.now()}`,
//         ),
//       );
//     }
//     const request = {
//       cmd: 'register_req',
//       app: 'Hive Keychain',
//       accounts,
//     };
//     this.send(JSON.stringify(request));
//   };

//   checkPayload = (payload: HAS_BroadcastPayload | HAS_AuthPayload) => {
//     if (payload.uuid) {
//       // validate APP request forwarded by HAS
//       assert(
//         payload.uuid && typeof payload.uuid == 'string',
//         `invalid payload (uuid)`,
//       );
//       assert(
//         payload.expire && typeof payload.expire == 'number',
//         `invalid payload (expire)`,
//       );
//       assert(
//         payload.account && typeof payload.account == 'string',
//         `invalid payload (account)`,
//       );
//       assert(
//         Date.now() < payload.expire,
//         `request expired - now:${Date.now()} > expire:${payload.expire}}`,
//       );
//     }
//   };

//   answerAuthReq = async (
//     payload: HAS_AuthPayload,
//     approve: boolean,
//     callback: () => void,
//   ) => {
//     try {
//       // NOTE: The default expiration time for a token is 24 hours - It can be set to a longer duration for "service" APPS
//       const EXPIRE_DELAY_APP = 24 * 60 * 60 * 1000;
//       // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
//       //       Secure PKSA should read it from the QR code scanned by the user
//       const connection = this.connections.find((e) => e.uuid === payload.uuid);
//       const app_key = connection.key;

//       if (approve) {
//         const token = uuid.v4() as string;
//         const expire = Date.now() + EXPIRE_DELAY_APP;
//         const auth_ack_data: HAS_AuthChallengeData = {
//           token: token,
//           expire: expire,
//         };
//         console.log('before dec');
//         if (payload.decryptedData.app.pubkey) {
//           auth_ack_data.challenge = await dAppChallenge(
//             payload.account,
//             payload.decryptedData.app.pubkey,
//             payload.account,
//           );
//         }
//         console.log('after dec', auth_ack_data);
//         //const challenge = Crypto.AES.encrypt(payload.uuid, app_key).toString();
//         const data = Crypto.AES.encrypt(
//           JSON.stringify(auth_ack_data),
//           app_key,
//         ).toString();
//         this.send(
//           JSON.stringify({
//             cmd: 'auth_ack',
//             uuid: payload.uuid,
//             data,
//             //challenge: challenge,
//           }),
//         );
//         // Add new token into storage
//         connection.tokens.push({
//           token: token,
//           expire: expire,
//           app: payload.decryptedData.app.name,
//           ts_create: new Date().toISOString(),
//           ts_expire: new Date(expire).toISOString(),
//         });
//       } else {
//         this.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
//       }
//       callback();
//       // remove expired tokens
//       connection.tokens = connection.tokens.filter(
//         (o) => o.expire > Date.now(),
//       );
//     } catch (e) {
//       console.log(e);
//       this.send(
//         JSON.stringify({
//           cmd: 'auth_err',
//           uuid: payload.uuid,
//           error: 'Request canceled by user',
//         }),
//       );
//     }
//   };

//   answerSuccessfulBroadcastReq = (
//     payload: HAS_BroadcastPayload,
//     result: any,
//   ) => {
//     console.log(payload);
//     if (payload.decryptedData.broadcast) {
//       this.send(
//         JSON.stringify({
//           cmd: 'sign_ack',
//           uuid: payload.uuid,
//           broadcast: payload.decryptedData.broadcast,
//           data: result.id,
//         }),
//       );
//     } else {
//       throw new Error('Transaction signing not implemented');
//       //                 const tx = new Transaction
//       //                 tx.ops = ops
//       // //                const signed_tx = await hiveClient.broadcast.sign(tx, PrivateKey.from(key_private))
//       //                 this.send(JSON.stringify({cmd:"sign_ack", uuid:uuid, broadcast:payload.broadcast, data:"signed_tx"}))
//     }
//   };

//   answerFailedBroadcastReq = (payload: HAS_BroadcastPayload) => {
//     this.send(JSON.stringify({cmd: 'sign_nack', uuid: payload.uuid}));
//   };

//   send = (message: string) => {
//     console.log(`[SEND] ${message}`);
//     this.ws.send(message);
//   };
// }

// const dAppChallenge = async (
//   username: string,
//   pubkey: string,
//   message: string,
// ) => {
//   try {
//     const accounts = (store.getState() as RootState).accounts;
//     const account = accounts.find((e) => e.name === username);
//     if (!account) return null;
//     const key = account.keys.posting;
//     if (!key)
//       //TODO : throw error;
//       return null;
//     return await encodeMemo(key, pubkey, `#${message}`);
//   } catch (e) {
//     console.log('error encrypting', e);
//   }
// };

// const prepareChallengeRequest = async (
//   username: string,
//   serverKey: string,
//   message: string,
// ) => {
//   try {
//     const key = getLeastDangerousKey(username);
//     console.log(key);
//     return {
//       key_type: key.type,
//       challenge: await encodeMemo(key.value, serverKey, `#${message}`),
//       name: username,
//     };
//   } catch (e) {
//     console.log('memo', e);
//   }
// };

// const getLeastDangerousKey = (username: string) => {
//   const accounts = (store.getState() as RootState).accounts;
//   const account = accounts.find((e) => e.name === username);
//   if (!account) return null;
//   else if (account.keys.memo) return {type: 'memo', value: account.keys.memo};
//   else if (account.keys.memo)
//     return {type: 'posting', value: account.keys.posting};
//   else return {type: 'active', value: account.keys.active};
// };

// export default HAS;
