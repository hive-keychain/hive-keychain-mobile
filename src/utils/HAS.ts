import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import {store} from 'store';
import {ModalComponent} from './modal.enum';
import {navigate} from './navigation';

export type HAS_RequestPayload = {
  account: string;
  uuid: string;
  host: string;
  key: string;
};

export const showHASInitRequest = (data: HAS_RequestPayload) => {
  store.dispatch(showHASInitRequestAsTreated());
  navigate('ModalScreen', {
    name: ModalComponent.HAS_INIT,
    data,
  });
};

let has: HAS = null;
export const getHAS = () => {
  if (!has) {
    has = new HAS();
  }
  return has;
};
class HAS {
  ws: WebSocket = null;
  connect = (data: HAS_RequestPayload) => {
    this.ws = new WebSocket(data.host);
    this.ws.onopen = () => {
      console.log('Connection established');
      this.send(JSON.stringify({cmd: 'key_req'}));
    };
    this.ws.onmessage = async function (event) {
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
            const key_server = payload.key;
            console.log('HAS key ack ', key_server);
            // if (key_server) {
            //   const request = {
            //     cmd: 'register_req',
            //     app: 'Keychain Emulator',
            //     accounts: [],
            //   };
            //   try {
            //     for (const account of accounts) {
            //       checkUsername(account.name, true);
            //       const key_type = 'posting';
            //       // retrieve account private key from PKSA storage
            //       const key_private = getPrivateKey(account.name, key_type);
            //       if (!key_private)
            //         throw new Error(
            //           `Private ${key_type} key missing for ${account.name}`,
            //         );
            //       const challenge = hivejs.memo.encode(
            //         key_private,
            //         key_server,
            //         '#' + Date.now(),
            //       );
            //       request.accounts.push({
            //         name: account.name,
            //         key_type: key_type,
            //         challenge: challenge,
            //       });
            //     }
            //     // Register accounts on HAS server
            //     this.send(JSON.stringify(request));
            //   } catch (e) {
            //     logerror(e.message);
            //   }
            // }
            break;
          /*
          // Process App requests relayed by HAS
          case 'auth_req':
            // Authentications request
            // NOTE:    PKSA may not process "auth_req" from the HAS except when it runs in "service" mode
            //          It the PKSA wants to display info from the app meta data, it must wait for "auth_req" before displaying information to the user and sending "auth_ack" or "auth_nack" to HAS
            //          The app meta data are not provided in the QR code or deep link
            //          Processing "auth_req" allows a "service" APP to retieve a token/expiration and optionally communication encryption key
            // WARNING: When accepting an auth_req with the encryption key in the payload, the HAS will be able to decrypt signing requests!
            try {
              const account = accounts.find((o) => o.name == payload.account);
              assert(account, 'unknown account');

              // NOTE: If the PKSA processes "auth_req", it should ask user's approval here with code like "const approve = getUserApproval(payload)"
              //       If the PKSA runs in "service" mode,
              //       - set approve to true if you need to initialise your APP token
              //       - set approve to false if you want when your APP already has a valid token
              //       Alternatively, you can initialise from your storage file.
              const approve =
                JSON.parse(fs.readFileSync(storage)).auto_approve_auth_req ||
                false;

              // NOTE: The default expiration time for a token is 24 hours - It can be set to a longer duration for "service" APPS
              const EXPIRE_DELAY_APP = 24 * 60 * 60 * 1000;
              // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
              //       Secure PKSA should read it from the QR code scanned by the user
              const app_key = payload.key;

              if (approve) {
                const token = uuidv4();
                const expire = Date.now() + EXPIRE_DELAY_APP;
                const challenge = CryptoJS.AES.encrypt(
                  payload.uuid,
                  app_key,
                ).toString();
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
                account.auths.push({
                  token: token,
                  expire: expire,
                  key: app_key,
                  app: payload.metadata.name,
                  ts_create: datetoISO(new Date()),
                  ts_expire: datetoISO(new Date(expire)),
                });
              } else {
                this.send(
                  JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}),
                );
              }
              // remove expired tokens
              account.auths = account.auths.filter(
                (o) => o.expire > Date.now(),
              );
              // Update local storage
              fs.writeFileSync(
                storage,
                JSON.stringify(
                  {auto_approve_auth_req: approve, accounts: accounts},
                  null,
                  '\t',
                ),
              );
            } catch (e) {
              this.send(
                JSON.stringify({
                  cmd: 'auth_err',
                  uuid: payload.uuid,
                  error: e.message,
                }),
              );
            }
            break;
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
        this.send(JSON.stringify({cmd: 'error', error: (e as any).message}));
      }
      console.debug('message processed');
    };
  };
  send = (message: string) => {
    console.log(`[SEND] ${message}`);
    this.ws.send(message);
  };
}

export default HAS;
