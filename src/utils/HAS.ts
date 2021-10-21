import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
import {store} from 'store';
import WebSocket from 'ws';
import {HASConfig} from './config';
const wsClient = new WebSocket(HASConfig.socket);

export type HAS_RequestPayload = {
  account: string;
  uuid: string;
  host: string;
  key: string;
};

export const showHASInitRequest = (data: HAS_RequestPayload) => {
  store.dispatch(showHASInitRequestAsTreated());
  //navigate();
};
