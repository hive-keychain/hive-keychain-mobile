import {
  clearHASState,
  showHASInitRequestAsTreated,
} from 'actions/hiveAuthenticationService';
import assert from 'assert';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import {RootState, store} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
import {HAS_Session} from './has.types';
import {answerAuthReq} from './helpers/auth';
import {prepareRegistrationChallenge} from './helpers/challenge';
import {onMessageReceived} from './messages';
import {HAS_AuthPayload, HAS_SignPayload} from './payloads.types';

store.dispatch(clearHASState());

export const showHASInitRequest = (data: HAS_State) => {
  for (const instance of data.instances) {
    const host = instance.host.replace(/\/$/, '');

    if (instance.init && !data.sessions.find((e) => e.host === host && !e.init))
      continue;
    getHAS(host).connect(data.sessions);
    store.dispatch(showHASInitRequestAsTreated(host));
  }
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
  awaitingRegistration: string[] = [];
  registeredAccounts: string[] = [];

  constructor(host: string) {
    this.host = host;
    this.ws = new WebSocket(host);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
  }

  //Connection and initialization
  connect = (sessions: HAS_Session[]) => {
    for (const session of sessions) {
      if (session.init) continue;
      if (this.registeredAccounts.includes(session.account)) {
        navigate('ModalScreen', {
          name: ModalComponent.HAS_AUTH,
          data: {...session, has: this, callback: answerAuthReq},
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

  //Socket

  onOpen = () => {
    console.log('Connection established');
    this.send(JSON.stringify({cmd: 'key_req'}));
  };

  onClose = () => {
    console.log('Connection lost');
  };

  //Registration
  registerAccounts = async (acc: string[]) => {
    const accounts = [];
    for (const account of acc) {
      accounts.push(
        await prepareRegistrationChallenge(
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

  // Sending and receiving messages
  send = (message: string) => {
    console.log(`[SEND] ${message}`);
    this.ws.send(message);
  };

  onMessage = (event: WebSocketMessageEvent) => {
    onMessageReceived(event, this);
  };

  // Keys

  getServerKey = () => {
    return (store.getState() as RootState).hive_authentication_service.instances.find(
      (e) => e.host === this.host,
    )?.server_key;
  };

  // static

  static checkPayload = (payload: HAS_SignPayload | HAS_AuthPayload) => {
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
}

export default HAS;
