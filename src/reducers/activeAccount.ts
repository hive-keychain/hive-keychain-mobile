import {ExtendedAccount} from '@hiveio/dhive';
import {Manabar} from '@hiveio/dhive/lib/chain/rc';
import {accountKeys, actionPayload, activeAccount} from 'actions/interfaces';
import {
  ACTIVE_ACCOUNT,
  ACTIVE_ACCOUNT_RC,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
} from 'actions/types';

const activeAccountReducer = (
  state: activeAccount = {
    account: {} as ExtendedAccount,
    keys: {} as accountKeys,
    rc: {} as Manabar,
  },
  {type, payload}: actionPayload<any>,
): activeAccount => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {...state, ...payload};
    case ACTIVE_ACCOUNT_RC:
      return {...state, rc: payload};
    case FORGET_ACCOUNT:
    case FORGET_ACCOUNTS:
      return {account: {} as ExtendedAccount, keys: {}, rc: {} as Manabar};
    default:
      return state;
  }
};

export default activeAccountReducer;
