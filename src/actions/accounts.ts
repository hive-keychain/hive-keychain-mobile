import {loadAccount} from 'actions/hive';
import Toast from 'react-native-simple-toast';
import {AppThunk} from 'src/hooks/redux';
import {encryptJson} from 'utils/encrypt';
import validateKeys from 'utils/keyValidation';
import {clearKeychain, saveOnKeychain} from 'utils/keychainStorage';
import {translate} from 'utils/localize';
import {navigate, resetStackAndNavigate} from 'utils/navigation';
import {WidgetUtils} from 'utils/widget.utils';
import {
  Account,
  AccountKeys,
  AccountsPayload,
  ActionPayload,
  KeyTypes,
  PubKeyTypes,
} from './interfaces';
import {
  ADD_ACCOUNT,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
  UPDATE_ACCOUNTS,
} from './types';

export const addAccount = (
  name: string,
  keys: AccountKeys,
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
  const action: ActionPayload<AccountsPayload> = {
    type: ADD_ACCOUNT,
    payload: {account: {name, keys}},
  };
  dispatch(action);
  const accounts = [...previousAccounts, {name, keys}];
  const encrypted = encryptJson({list: accounts}, mk);

  await WidgetUtils.addAccountBalanceList(
    name,
    accounts.map((acc) => acc.name),
  );

  await saveOnKeychain('accounts', encrypted);
  if (wallet) {
    dispatch(loadAccount(name));
    qr ? resetStackAndNavigate('WALLET') : navigate('WALLET');
  }
};

export const forgetAccounts = (): AppThunk => async (dispatch) => {
  clearKeychain('accounts');
  dispatch({
    type: FORGET_ACCOUNTS,
  });
  await WidgetUtils.clearAccountBalanceList();
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
    const action: ActionPayload<AccountsPayload> = {
      type: FORGET_ACCOUNT,
      payload: {name: username},
    };
    dispatch(action);
    await WidgetUtils.removeAccountBalanceList(username);
  } else {
    dispatch(forgetAccounts());
  }
};

export const forgetKey = (username: string, key: KeyTypes): AppThunk => async (
  dispatch,
) => {
  dispatch(
    updateAccounts((account: Account) => {
      if (account.name === username) {
        const keys = {...account.keys};
        delete keys[key];
        const pubKey: PubKeyTypes = PubKeyTypes[key];
        delete keys[pubKey];
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
): AppThunk => async (dispatch) => {
  const keys = await validateKeys(username, key);
  if (!keys) {
    Toast.show(translate('toast.keys.not_a_key'));
  } else if (!keys[type]) {
    Toast.show(translate('toast.keys.not_wanted_key', {type}));
  } else {
    dispatch(
      updateAccounts((account: Account) => {
        if (account.name === username) {
          return {...account, keys: {...account.keys, ...keys}};
        } else {
          return account;
        }
      }),
    );
  }
};

const updateAccounts = (mapper: (arg0: Account) => Account): AppThunk => async (
  dispatch,
  getState,
) => {
  const mk = getState().auth.mk;
  const previousAccounts = getState().accounts;
  const accounts = previousAccounts.map(mapper);
  const encrypted = encryptJson({list: accounts}, mk);
  await saveOnKeychain('accounts', encrypted);
  const actions: ActionPayload<AccountsPayload> = {
    type: UPDATE_ACCOUNTS,
    payload: {accounts},
  };
  dispatch(actions);
};
