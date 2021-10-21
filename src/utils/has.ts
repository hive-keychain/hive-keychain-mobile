import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
import {store} from 'store';
import WebSocket from 'ws';
const wsClient = new WebSocket('wss://hive-auth.arcange.eu');

export type HAS_RequestPayload = {
  account: string;
  uuid: string;
  host: string;
  key: string;
};

export const showHASInitRequest = (data: HAS_RequestPayload) => {
  store.dispatch(showHASInitRequestAsTreated());
};
