import {Operation} from '@hiveio/dhive';
import {KeyTypes} from 'actions/interfaces';
import {HAS_SignDecrypted} from 'utils/hiveAuthenticationService/payloads.types';
import testOperation from '__tests__/utils-for-testing/data/test-operation';

export default {
  _default: {
    key_type: KeyTypes.active,
    ops: [
      testOperation.filter((op) => op[0] === 'account_create')[0],
    ] as Operation[],
    broadcast: false,
  } as HAS_SignDecrypted,
};
