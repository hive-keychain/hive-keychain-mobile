import Toast from 'react-native-simple-toast';

import {
  ADD_ACCOUNT,
  FORGET_ACCOUNTS,
  FORGET_ACCOUNT,
  UPDATE_ACCOUNTS,
} from './types';
import {encryptJson} from 'utils/encrypt';
import {navigate, resetStackAndNavigate} from 'utils/navigation';
import {translate} from 'utils/localize';
import {saveOnKeychain, clearKeychain} from 'utils/keychainStorage';
import validateKeys from 'utils/keyValidation';
import {loadAccount} from 'actions/hive';
import {ThunkAction} from 'redux-thunk';
import {AppThunk} from 'src/hooks/redux';
import {account, accountKeys, KeyTypes} from './interfaces';

export const addAccount = (
  name: string,
  keys: accountKeys,
  wallet: boolean,
  qr: boolean,
): AppThunk => async (dispatch, getState) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  if (previousAccounts.find((e) => e.name === name)) {
    Toast.show(translate('toast.account_already'));
    if (wallet) {
      qr ? resetStackAndNavigate('WALLET') : navigate('WALLET');
    }
    return;
  }
  dispatch({type: ADD_ACCOUNT, payload: {name, keys}});
  const accounts = [...previousAccounts, {name, keys}];
  const encrypted = encryptJson({list: accounts}, mk);
  await saveOnKeychain('accounts', encrypted);
  if (wallet) {
    dispatch(loadAccount(name));
    qr ? resetStackAndNavigate('WALLET') : navigate('WALLET');
  }
};

export const forgetAccounts = (): AppThunk => (dispatch) => {
  clearKeychain('accounts');
  dispatch({
    type: FORGET_ACCOUNTS,
  });
};

export const forgetAccount = (username: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  const accounts = previousAccounts.filter((e) => e.name !== username);
  if (accounts.length) {
    const encrypted = encryptJson({list: accounts}, mk);
    await saveOnKeychain('accounts', encrypted);
    dispatch({type: FORGET_ACCOUNT, payload: username});
    navigate('WALLET');
  } else {
    dispatch(forgetAccounts());
  }
};

export const forgetKey = (username: string, key: KeyTypes): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(
    updateAccounts((account: account) => {
      if (account.name === username) {
        const keys = {...account.keys};
        delete keys[key];
        delete keys[`${key}Pubkey`];
        return {...account, keys};
      } else {
        return account;
      }
    }),
  );
};

export const addKey = (
  username: string,
  type: KeyTypes,
  key: string,
): AppThunk => async (dispatch, getState) => {
  const keys = await validateKeys(username, key);
  if (!keys) {
    Toast.show(translate('toast.keys.not_a_key'));
  } else if (!keys[type]) {
    Toast.show(translate('toast.keys.not_wanted_key', {type}));
  } else {
    dispatch(
      updateAccounts((account: account) => {
        if (account.name === username) {
          return {...account, keys: {...account.keys, ...keys}};
        } else {
          return account;
        }
      }),
    );
  }
};

const updateAccounts = (mapper: (arg0: account) => account): AppThunk => async (
  dispatch,
  getState,
) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  const accounts = previousAccounts.map(mapper);
  const encrypted = encryptJson({list: accounts}, mk);
  await saveOnKeychain('accounts', encrypted);
  dispatch({type: UPDATE_ACCOUNTS, payload: accounts});
};
