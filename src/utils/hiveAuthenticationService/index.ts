import {
  addSessionToken,
  showHASInitRequestAsTreated,
} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import {signBuffer} from 'components/bridge';
import Crypto from 'crypto-js';
import uuid from 'react-native-uuid';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import {RootState, store} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import {KeychainKeyTypesLC} from '../keychain.types';
import {HAS_Session} from './has.types';
import {dAppChallenge, prepareChallengeRequest} from './helpers';
import {onMessageReceived} from './messages';
import {
  HAS_AuthChallengeData,
  HAS_AuthPayload,
  HAS_ChallengePayload,
  HAS_SignPayload,
} from './payloads.types';

//store.dispatch(clearHASState());

export const showHASInitRequest = (data: HAS_State) => {
  for (const instance of data.instances) {
    if (
      instance.init &&
      !data.sessions.find((e) => e.host === instance.host && !e.init)
    )
      continue;
    getHAS(instance.host).connect(data.sessions);
    store.dispatch(showHASInitRequestAsTreated(instance.host));
  }
};

let has: HAS[] = [];

export const getHAS = (host: string) => {
  const formatedHost = host.replace(/\/$/, '');
  const existing_has = has.find((e) => e.host === formatedHost);
  if (!existing_has) {
    const new_HAS = new HAS(formatedHost);
    has.push(new_HAS);
    return new_HAS;
  } else return existing_has;
};

class HAS {
  ws: WebSocket = null;
  host: string = null;
  awaitingRegistration: string[] = [];
  registeredAccounts: string[] = [];

  constructor(host: string) {
    this.host = host;
    this.ws = new WebSocket(host);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
  }

  connect = (sessions: HAS_Session[]) => {
    for (const session of sessions) {
      if (session.init) continue;
      if (this.registeredAccounts.includes(session.account)) {
        navigate('ModalScreen', {
          name: ModalComponent.HAS_AUTH,
          data: {...session, callback: this.answerAuthReq},
        });
      } else {
        if (this.getServerKey()) {
          this.registerAccounts([session.account]);
        } else {
          this.awaitingRegistration.push(session.account);
        }
      }
    }
  };

  onOpen = () => {
    console.log('Connection established');
    this.send(JSON.stringify({cmd: 'key_req'}));
  };

  onClose = () => {
    console.log('Connection lost');
  };

  onMessage = (event: WebSocketMessageEvent) => {
    onMessageReceived(event, this);
  };

  registerAccounts = async (acc: string[]) => {
    const accounts = [];
    for (const account of acc) {
      accounts.push(
        await prepareChallengeRequest(
          account,
          this.getServerKey(),
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

  checkPayload = (payload: HAS_SignPayload | HAS_AuthPayload) => {
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
      const EXPIRE_DELAY_APP = 1 * 60 * 1000;
      // NOTE: In "service" or "debug" mode, the APP can pass the encryption key to the PKSA in its auth_req
      //       Secure PKSA should read it from the QR code scanned by the user
      const session = HAS.findSessionByUUID(payload.uuid);
      const app_key = session.auth_key;

      if (approve) {
        const token = uuid.v4() as string;
        const expire = Date.now() + EXPIRE_DELAY_APP;
        const auth_ack_data: HAS_AuthChallengeData = {
          token,
          expire,
        };
        if (payload.decryptedData.app.pubkey) {
          auth_ack_data.challenge = await dAppChallenge(
            payload.account,
            payload.decryptedData.app.pubkey,
            payload.account,
          );
        }

        const data = Crypto.AES.encrypt(
          JSON.stringify(auth_ack_data),
          app_key,
        ).toString();
        this.send(
          JSON.stringify({
            cmd: 'auth_ack',
            uuid: payload.uuid,
            data,
          }),
        );
        const sessionToken = {
          token: token,
          expiration: expire,
          app: payload.decryptedData.app.name,
          ts_create: new Date().toISOString(),
          ts_expire: new Date(expire).toISOString(),
        };
        store.dispatch(addSessionToken(payload.uuid, sessionToken));
      } else {
        this.send(JSON.stringify({cmd: 'auth_nack', uuid: payload.uuid}));
      }
      callback();
      // remove expired tokens
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

  answerSuccessfulBroadcastReq = (payload: HAS_SignPayload, result: any) => {
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

  answerFailedBroadcastReq = (payload: HAS_SignPayload) => {
    this.send(JSON.stringify({cmd: 'sign_nack', uuid: payload.uuid}));
  };

  send = (message: string) => {
    console.log(`[SEND] ${message}`);
    this.ws.send(message);
  };

  answerChallengeReq = async (
    payload: HAS_ChallengePayload,
    approve: boolean,
    session: HAS_Session,
    callback: (success: boolean) => void,
  ) => {
    if (approve) {
      const accounts = (store.getState() as RootState).accounts;
      const account = accounts.find((e) => e.name === payload.account);
      const challenge = await signBuffer(
        account.keys[payload.decrypted_data.key_type as KeychainKeyTypesLC],
        payload.decrypted_data.challenge,
      );
      const pubkey =
        account.keys[
          `${payload.decrypted_data.key_type as KeychainKeyTypesLC}Pubkey`
        ];
      const data = {challenge, pubkey};
      const signedData = Crypto.AES.encrypt(
        JSON.stringify(data),
        session.auth_key,
      ).toString();
      this.send(
        JSON.stringify({
          cmd: 'challenge_ack',
          data: signedData,
          uuid: payload.uuid,
        }),
      );
      callback(true);
    }
  };

  static findSessionByUUID = (uuid: string) => {
    return (store.getState() as RootState).hive_authentication_service.sessions.find(
      (e) => e.uuid === uuid,
    );
  };

  static findSessionByToken = (token: string) => {
    return (store.getState() as RootState).hive_authentication_service.sessions.find(
      (e) => e.token.token === token,
    );
  };

  getServerKey = () => {
    return (store.getState() as RootState).hive_authentication_service.instances.find(
      (e) => e.host === this.host,
    )?.server_key;
  };
}

export default HAS;
