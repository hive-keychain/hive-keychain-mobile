import {loadAccount} from 'actions/hive';
import Toast from 'react-native-root-toast';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {AppThunk} from 'src/hooks/redux';
import validateKeys from 'utils/keyValidation.utils';
import {translate} from 'utils/localize';
import {goBack, navigate, resetStackAndNavigate} from 'utils/navigation.utils';
import {EncryptedStorageUtils} from 'utils/storage/encryptedStorage.utils';
import StorageUtils from 'utils/storage/storage.utils';
import {WidgetUtils} from 'utils/widget.utils';
import {
  Account,
  AccountKeys,
  AccountsPayload,
  ActionPayload,
  KeyTypes,
  PubKeyTypes,
} from './interfaces';
import {showModal} from './message';
import {
  ADD_ACCOUNT,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
  UPDATE_ACCOUNTS,
} from './types';

export const addAccount =
  (
    name: string,
    keys: AccountKeys,
    wallet: boolean,
    qr: boolean,
    multipleAccounts?: boolean,
    mainStack = false,
  ): AppThunk =>
  async (dispatch, getState) => {
    const mk = getState().auth.mk;
    const previousAccounts = getState().accounts;
    if (previousAccounts.length === 0) {
      StorageUtils.requireBiometricsLogin(
        mk,
        'settings.settings.security.biometrics',
      );
    }
    if (previousAccounts.find((e) => e.name === name)) {
      Toast.show(translate('toast.account_already', {account: name}));
      if (multipleAccounts) return;
      if (wallet) {
        qr ? goBack() : navigate('Wallet');
      }
      return;
    }
    const action: ActionPayload<AccountsPayload> = {
      type: ADD_ACCOUNT,
      payload: {account: {name, keys}},
    };
    dispatch(action);
    const accounts = [...previousAccounts, {name, keys}];
    EncryptedStorageUtils.saveOnEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      {list: accounts},
      mk,
    );

    await WidgetUtils.addAccountBalanceList(
      name,
      accounts.map((acc) => acc.name),
    );

    if (multipleAccounts) {
      Toast.show(translate('toast.added_account', {account: name}));
      return;
    }
    if (wallet) {
      dispatch(loadAccount(name));
      qr
        ? mainStack
          ? goBack()
          : resetStackAndNavigate('Wallet')
        : navigate('Wallet');
    }
  };

export const forgetAccounts = (): AppThunk => async (dispatch) => {
  EncryptedStorageUtils.clearEncryptedStorage();
  dispatch({
    type: FORGET_ACCOUNTS,
  });
  await WidgetUtils.clearAccountBalanceList();
};

export const forgetAccount =
  (username: string): AppThunk =>
  async (dispatch, getState) => {
    const mk = getState().auth.mk;
    const previousAccounts = getState().accounts;
    const accounts = previousAccounts.filter((e) => e.name !== username);
    if (accounts.length) {
      await EncryptedStorageUtils.saveOnEncryptedStorage(
        KeychainStorageKeyEnum.ACCOUNTS,
        {list: accounts},
        mk,
      );
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

export const forgetKey =
  (username: string, key: KeyTypes): AppThunk =>
  async (dispatch, getState) => {
    const keysLenght =
      Object.keys(
        getState().accounts.filter((acc) => acc.name === username)[0].keys,
      ).length / 2;

    if (keysLenght === 1) {
      dispatch(forgetAccount(username));
      Toast.show(translate('toast.account_removed', {account: username}), {
        duration: Toast.durations.LONG,
      });
    } else {
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
      dispatch(
        showModal('toast.keys.key_removed', MessageModalType.SUCCESS, {
          type: key,
        }),
      );
    }
  };

export const addKey =
  (username: string, type: KeyTypes, key: string): AppThunk =>
  async (dispatch) => {
    const keys = await validateKeys(username, key);
    if (!keys) {
      dispatch(showModal('toast.keys.not_a_key', MessageModalType.ERROR));
    } else if (!keys[type]) {
      dispatch(
        showModal('toast.keys.not_wanted_key', MessageModalType.ERROR, {type}),
      );
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
      dispatch(
        showModal('toast.keys.key_added', MessageModalType.SUCCESS, {type}),
      );
    }
  };

export const reorderAccounts =
  (newAccounts: Account[]): AppThunk =>
  async (dispatch, getState) => {
    const mk = getState().auth.mk;
    await EncryptedStorageUtils.saveOnEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      {list: newAccounts},
      mk,
    );
    dispatch({
      type: UPDATE_ACCOUNTS,
      payload: {accounts: newAccounts},
    });
  };

const updateAccounts =
  (mapper: (arg0: Account) => Account): AppThunk =>
  async (dispatch, getState) => {
    const mk = getState().auth.mk;
    const previousAccounts = getState().accounts;
    const accounts = previousAccounts.map(mapper);
    EncryptedStorageUtils.saveOnEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      {list: accounts},
      mk,
    );
    const actions: ActionPayload<AccountsPayload> = {
      type: UPDATE_ACCOUNTS,
      payload: {accounts},
    };
    dispatch(actions);
  };
