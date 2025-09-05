import {
  clearHASState,
  showHASInitRequestAsTreated,
  updateInstanceConnectionStatus,
} from "actions/hiveAuthenticationService";
import SimpleToast from "react-native-root-toast";
import { HAS_State } from "reducers/hiveAuthenticationService";
import { RootState, store } from "store";
import { translate } from "utils/localize";
import { ModalComponent } from "utils/modal.enum";
import { navigate } from "utils/navigation";
import { HAS_Session } from "./has.types";
import { answerAuthReq } from "./helpers/auth";
import { prepareRegistrationChallenge } from "./helpers/challenge";
import { onMessageReceived } from "./messages";
import { processAuthenticationRequest } from "./messages/authenticate";
import { HAS_AuthPayload } from "./payloads.types";

let previousState: RootState = store.getState();

store.subscribe(() => {
  if (!previousState) return;
  const state = store.getState() as RootState;
  if (
    state.auth.mk !== previousState.auth.mk ||
    previousState.hive_authentication_service !==
      state.hive_authentication_service
  ) {
    previousState = state;
    if (!!state.auth.mk && state.hive_authentication_service) {
      showHASInitRequest(state.hive_authentication_service);
    }
  }
});

export const showHASInitRequest = (data: HAS_State) => {
  // Iinitialize instances if needed
  for (const instance of data.instances) {
    const host = instance.host.replace(/\/$/, "");

    if (
      instance.init &&
      !data.sessions.find((e) => e.host === host && !e.init)
    ) {
      continue;
    }
    getHAS(host).connect(data.sessions);
    store.dispatch(showHASInitRequestAsTreated(host));
  }
  // Disconnect and remove instances if needed
  has = has.filter((hasInstance) => {
    if (!data.instances.find((e) => e.host === hasInstance.host)) {
      hasInstance.ws.close();
      return false;
    }
    return true;
  });
};

export const clearHAS = () => {
  // Clear all HAS state
  for (const hasInstance of has) {
    hasInstance.ws.close();
  }
  has = [];
  store.dispatch(clearHASState());
};

export const restartHASSockets = () => {
  // Reconnect ws after deconnection (red indicator)
  for (const hasInstance of has) {
    if (hasInstance.ws.readyState === 3) {
      hasInstance.reconnect();
    }
  }
};

let has: HAS[] = [];

export const getHAS = (host: string) => {
  // Get Has instance by host or create it
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
  awaitingAuth: HAS_AuthPayload[] = [];

  constructor(host: string) {
    this.host = host;
    this.initConnection();
  }

  //Connection and initialization
  initConnection = () => {
    this.ws = new WebSocket(this.host);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
  };

  reconnect = () => {
    this.awaitingRegistration = [
      ...this.registeredAccounts,
      ...this.awaitingRegistration,
    ];
    this.registeredAccounts = [];
    this.initConnection();
  };

  connect = (sessions: HAS_Session[]) => {
    for (const session of sessions) {
      if (session.init) continue;
      if (this.registeredAccounts.includes(session.account)) {
        if (session.token) {
          navigate("ModalScreen", {
            name: ModalComponent.HAS_AUTH,
            data: { ...session, has: this, callback: answerAuthReq },
          });
        } else {
          const sessionAuthReq = this.awaitingAuth.find(
            (e) => e.uuid === session.uuid
          );
          if (sessionAuthReq) {
            processAuthenticationRequest(this, sessionAuthReq);
          }
        }
      } else {
        if (this.getServerKey()) {
          this.registerAccounts([session.account]);
        } else if (!this.awaitingRegistration.includes(session.account)) {
          this.awaitingRegistration.push(session.account);
        }
      }
    }
  };

  //Socket

  onOpen = () => {
    store.dispatch(updateInstanceConnectionStatus(this.host, true));
    this.send(JSON.stringify({ cmd: "key_req" }));
  };

  onClose = () => {
    console.log("Connection lost");
    store.dispatch(updateInstanceConnectionStatus(this.host, false));
  };

  //Registration
  registerAccounts = async (acc: string[]) => {
    const accounts = [];
    for (const account of acc) {
      const challenge = await prepareRegistrationChallenge(
        this,
        account,
        this.getServerKey(),
        `${Date.now()}`
      );
      if (challenge) accounts.push(challenge);
    }
    if (!accounts.length) return;
    const request = {
      cmd: "register_req",
      app: "Hive Keychain",
      accounts,
    };
    SimpleToast.show(translate("wallet.has.toast.register"), {
      duration: SimpleToast.durations.SHORT,
    });
    this.send(JSON.stringify(request));
  };

  // Sending and receiving messages
  send = (message: string) => {
    this.ws.send(message);
  };

  onMessage = (event: WebSocketMessageEvent) => {
    onMessageReceived(event, this);
  };

  // Keys

  getServerKey = () => {
    return (
      store.getState() as RootState
    ).hive_authentication_service.instances.find((e) => e.host === this.host)
      ?.server_key;
  };
}

export default HAS;
