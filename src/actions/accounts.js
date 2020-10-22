import Toast from 'react-native-simple-toast';

import {
  ADD_ACCOUNT,
  FORGET_ACCOUNTS,
  FORGET_ACCOUNT,
  ADD_KEY,
  FORGET_KEY,
} from './types';
import {encryptJson} from 'utils/encrypt';
import {navigate} from 'utils/navigation';
import {translate} from 'utils/localize';
import {saveOnKeychain} from 'utils/keychainStorage';

export const addAccount = (name, keys, wallet) => async (
  dispatch,
  getState,
) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  if (previousAccounts.find((e) => e.name === name)) {
    Toast.show(translate('toast.account_already'));
    if (wallet) {
      navigate('WalletScreen');
    }
    return;
  }
  dispatch({type: ADD_ACCOUNT, payload: {name, keys}});
  const accounts = [...previousAccounts, {name, keys}];
  const encrypted = encryptJson({list: accounts}, mk);
  await saveOnKeychain('accounts', encrypted);
  if (wallet) {
    navigate('WalletScreen');
  }
};

export const forgetAccounts = () => (dispatch) => {
  dispatch({
    type: FORGET_ACCOUNTS,
  });
};

export const forgetAccount = (username) => async (dispatch, getState) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  const accounts = previousAccounts.filter((e) => e.name !== username);
  if (accounts.length) {
    const encrypted = encryptJson({list: accounts}, mk);
    await saveOnKeychain('accounts', encrypted);
    dispatch({type: FORGET_ACCOUNT, payload: username});
    navigate('WalletScreen');
  } else {
    dispatch(forgetAccounts());
  }
};

export const forgetKey = (username, key) => async (dispatch) => {};

export const addKey = (username, keys) => async (dispatch) => {};
