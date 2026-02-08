import activeAccountReducer from '../activeAccount';
import {
  ACTIVE_ACCOUNT,
  ACTIVE_ACCOUNT_RC,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
} from 'actions/types';
import {ExtendedAccount} from '@hiveio/dhive';
import {AccountKeys, RC} from 'actions/interfaces';

describe('activeAccount reducer', () => {
  const initialState = {
    account: {} as ExtendedAccount,
    keys: {} as AccountKeys,
    rc: {} as RC,
  };

  it('should return initial state', () => {
    expect(activeAccountReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle ACTIVE_ACCOUNT', () => {
    const account = {name: 'testuser'} as ExtendedAccount;
    const keys = {active: 'key123'} as AccountKeys;
    const action = {
      type: ACTIVE_ACCOUNT,
      payload: {account, keys},
    };
    const result = activeAccountReducer(initialState, action);
    expect(result.account).toEqual(account);
    expect(result.keys).toEqual(keys);
  });

  it('should handle ACTIVE_ACCOUNT_RC', () => {
    const rc = {current_mana: '1000'} as RC;
    const state = {
      account: {name: 'testuser'} as ExtendedAccount,
      keys: {} as AccountKeys,
      rc: {} as RC,
    };
    const action = {
      type: ACTIVE_ACCOUNT_RC,
      payload: rc,
    };
    const result = activeAccountReducer(state, action);
    expect(result.rc).toEqual(rc);
    expect(result.account).toEqual(state.account);
  });

  it('should handle FORGET_ACCOUNT', () => {
    const state = {
      account: {name: 'testuser'} as ExtendedAccount,
      keys: {active: 'key123'} as AccountKeys,
      rc: {current_mana: '1000'} as RC,
    };
    const action = {
      type: FORGET_ACCOUNT,
      payload: {},
    };
    const result = activeAccountReducer(state, action);
    expect(result).toEqual(initialState);
  });

  it('should handle FORGET_ACCOUNTS', () => {
    const state = {
      account: {name: 'testuser'} as ExtendedAccount,
      keys: {active: 'key123'} as AccountKeys,
      rc: {current_mana: '1000'} as RC,
    };
    const action = {
      type: FORGET_ACCOUNTS,
      payload: {},
    };
    const result = activeAccountReducer(state, action);
    expect(result).toEqual(initialState);
  });

  it('should return state unchanged for unknown action', () => {
    const state = {
      account: {name: 'testuser'} as ExtendedAccount,
      keys: {} as AccountKeys,
      rc: {} as RC,
    };
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = activeAccountReducer(state, action);
    expect(result).toEqual(state);
  });
});


















