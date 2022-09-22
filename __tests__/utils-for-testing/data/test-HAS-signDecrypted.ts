import {Operation} from '@hiveio/dhive';
import {KeyTypes} from 'actions/interfaces';
import {HAS_SignDecrypted} from 'utils/hiveAuthenticationService/payloads.types';

export default {
  _default: {
    key_type: KeyTypes.posting,
    ops: [] as Operation[],
    broadcast: false,
  } as HAS_SignDecrypted,
};
