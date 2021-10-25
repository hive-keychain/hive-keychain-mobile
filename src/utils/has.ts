import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import {encodeMemo} from 'components/bridge';
import {AES} from 'crypto-js';
import {RootState, store} from 'store';
import {v4} from 'uuid';
import {ModalComponent} from './modal.enum';
import {navigate} from './navigation';

export type HAS_ConnectPayload = {
  account: string;
  uuid: string;
  host: string;
  key: string;
};

export type HAS_AuthPayload = {
  cmd: 'auth_req';
  account: string;
  metadata: any;
  uuid: string;
  expire: number;
};

type Token = {
  token: string;
  expire: number;
  key: string;
  app: string;
  ts_create: string;
  ts_expire: string;
};

type Connection = {
  account: string;
  uuid: string;
  key: string;
  tokens: Token[];
};

export const showHASInitRequest = (data: any) => {
  store.dispatch(showHASInitRequestAsTreated());
  navigate('ModalScreen', {
    name: ModalComponent.HAS_INIT,
    data: data.data,
  });
};

let has: HAS = null;

export const getHAS = (host: string) => {
  if (!has) {
    has = new HAS(host);
  }
  return has;
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
      const payload =
        typeof event.data == 'string' ? JSON.parse(event.data) : event.data;
      if (!payload.cmd || typeof payload.cmd !== 'string') {
        throw new Error(`invalid payload (cmd)`);
      }
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
          console.log('authreq', payload);
          navigate('ModalScreen', {
            name: ModalComponent.HAS_AUTH,
            data: {...payload, callback: this.answerAuthReq},
          });
          break;
        /*
        case 'sign_req':
          try {
            assert(
              payload.broadcast == undefined ||
                typeof payload.broadcast == 'boolean',
              'Invalid payload (broadcast)',
            );
            const account = accounts.find((o) => o.name == payload.account);
            assert(account, 'unknown account');
            const auth = account.auths.find(
              (o) => o.token == payload.token && o.expire > Date.now(),
            );
            assert(auth, 'Token invalid or expired');
            // Decrypt the ops to sign with the encryption key associated to the token.
            const ops = JSON.parse(
              CryptoJS.AES.decrypt(payload.ops, auth.key).toString(
                CryptoJS.enc.Utf8,
              ),
            );
            for (const op of ops) {
              let key_type;
              switch (op[0]) {
                // Require posting key
                case 'claim_reward_balance':
                case 'claim_reward_balance2':
                case 'comment':
                case 'comment_options':
                case 'custom':
                case 'custom_binary':
                case 'custom_json':
                case 'delete_comment':
                case 'update_proposal':
                case 'update_proposal_votes':
                case 'vote':
                case 'vote2':
                  if (key_type != 'active') {
                    // avoid overwriting upper level
                    key_type = 'posting';
                  }
                  break;
                // Require active key
                case 'account_create':
                case 'account_create_with_delegation':
                case 'account_update':
                case 'account_update2':
                case 'account_witness_proxy':
                case 'account_witness_vote':
                case 'cancel_transfer_from_savings':
                case 'claim_account':
                case 'collateralized_convert':
                case 'convert':
                case 'create_claimed_account':
                case 'create_proposal':
                case 'delegate_vesting_shares':
                case 'escrow_approve':
                case 'escrow_dispute':
                case 'escrow_release':
                case 'escrow_transfer':
                case 'feed_publish':
                case 'limit_order_cancel':
                case 'limit_order_create':
                case 'limit_order_create2':
                case 'pow':
                case 'pow2':
                case 'recover_account':
                case 'recurrent_transfer':
                // NOTE: care should be taken of memo encryption
                case 'remove_proposal':
                case 'request_account_recovery':
                case 'reset_account':
                case 'set_withdraw_vesting_route':
                case 'smt_contribute':
                case 'smt_create':
                case 'smt_set_runtime_parameters':
                case 'smt_set_setup_parameters':
                case 'smt_setup':
                case 'smt_setup_emissions':
                case 'transfer':
                // NOTE: care should be taken of memo encryption
                case 'transfer_from_savings':
                case 'transfer_to_savings':
                // NOTE: care should be taken of memo encryption
                case 'transfer_to_vesting':
                case 'withdraw_vesting':
                case 'witness_set_properties':
                  key_type = 'active';
                  break;
                // Require owner key
                case 'change_recovery_account':
                case 'decline_voting_rights':
                case 'set_reset_account':
                  throw new Error('owner key not available in PKSA');
                default:
                  throw new Error(`unmanaged operation (${op[0]})`);
              }
              if (key_type == 'active') {
                throw new Error('Active key use denied');
              }
              const key_private = getPrivateKey(payload.account, key_type);
              if (!key_private) {
                throw new Error(`${key_type} key not available in PKSA`);
              }

              // TODO - PKSA should ask user approval here
              const approve = true;
              // TODO
              if (approve) {
                if (payload.broadcast) {
                  const res = await hiveClient.broadcast.sendOperations(
                    ops,
                    PrivateKey.from(key_private),
                  );
                  this.send(
                    JSON.stringify({
                      cmd: 'sign_ack',
                      uuid: payload.uuid,
                      broadcast: payload.broadcast,
                      data: res.id,
                    }),
                  );
                } else {
                  throw new Error('Transaction signing not implemented');
                  //                 const tx = new Transaction
                  //                 tx.ops = ops
                  // //                const signed_tx = await hiveClient.broadcast.sign(tx, PrivateKey.from(key_private))
                  //                 this.send(JSON.stringify({cmd:"sign_ack", uuid:uuid, broadcast:payload.broadcast, data:"signed_tx"}))
                }
              } else {
                this.send(
                  JSON.stringify({cmd: 'sign_nack', uuid: payload.uuid}),
                );
              }
            }
          } catch (e) {
            this.send(
              JSON.stringify({
                cmd: 'sign_err',
                uuid: payload.uuid,
                error: e.message,
              }),
            );
          }
          break;*/
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

  answerAuthReq = (payload: HAS_AuthPayload, approve: boolean) => {
    try {
      // NOTE: The default expiration time for a token is 24 hours - It can be set to a longer duration for "service" APPS
      const EXPIRE_DELAY_APP = 24 * 60 * 60 * 1000;
      // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
      //       Secure PKSA should read it from the QR code scanned by the user
      const connection = this.connections.find((e) => e.uuid === payload.uuid);
      const app_key = connection.key;

      if (approve) {
        const token = v4();
        const expire = Date.now() + EXPIRE_DELAY_APP;
        console.log(payload.uuid, app_key, 'b');

        const challenge = AES.encrypt(payload.uuid, app_key).toString();
        console.log(challenge, 'a');
        this.send(
          JSON.stringify({
            cmd: 'auth_ack',
            uuid: payload.uuid,
            token: token,
            expire: expire,
            challenge: challenge,
          }),
        );
        // Add new token into storage
        connection.tokens.push({
          token: token,
          expire: expire,
          key: app_key,
          app: payload.metadata.name,
          ts_create: new Date().toISOString(),
          ts_expire: new Date(expire).toISOString(),
        });
      } else {
        this.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
      }
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

  send = (message: string) => {
    console.log(`[SEND] ${message}`);
    this.ws.send(message);
  };
}

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
