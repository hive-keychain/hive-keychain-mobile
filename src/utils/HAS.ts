import {showHASInitRequestAsTreated} from 'actions/hiveAuthenticationService';
import {store} from 'store';
import {HASConfig} from './config';
import {ModalComponent} from './modal.enum';
import {navigate} from './navigation';

const wsClient = new WebSocket(HASConfig.socket);

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
