import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import BackGroundUtils from 'src/background';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {AppThunk} from 'src/hooks/redux';
import AuthUtils from 'utils/authentication.utils';
import {translate} from 'utils/localize';
import LockoutUtils from 'utils/lockout.utils';
import {navigate} from 'utils/navigation.utils';
import StorageUtils from 'utils/storage/storage.utils';
import {AccountsPayload, ActionPayload, NullableString} from './interfaces';
import {INIT_ACCOUNTS, LOCK, SIGN_UP, UNLOCK} from './types';

export const signUp =
  (pin: string): AppThunk =>
  async (dispatch) => {
    navigate('ChooseAccountOptionsScreen');
    const masterKey = AuthUtils.generateMasterKey();

    await AuthUtils.persistPinSecret(pin);
    await AuthUtils.persistMasterKey(masterKey, false);
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
      '3',
    );

    const action: ActionPayload<NullableString> = {
      type: SIGN_UP,
      payload: masterKey,
    };
    dispatch(action);
  };

export const unlock =
  (mk: string, errorCallback?: (b?: boolean) => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      // Check active lockout before attempting unlock
      const isLocked = await LockoutUtils.checkActiveLockout();
      if (isLocked) {
        errorCallback?.();
        return;
      }

      const accounts = await StorageUtils.getAccounts(mk);

      if (accounts && accounts.list) {
        const unlock: ActionPayload<NullableString> = {
          type: UNLOCK,
          payload: mk,
        };
        dispatch(unlock);
        const init: ActionPayload<AccountsPayload> = {
          type: INIT_ACCOUNTS,
          payload: {accounts: accounts.list},
        };
        dispatch(init);
        BackGroundUtils.init(accounts.list);

        // Reset failure counters on successful unlock
        await LockoutUtils.reset();
      }
      if (getState().browser.shouldFocus) {
        navigate('Browser');
      }
    } catch (e) {
      if (e.message === 'Wrapped error: User not authenticated') {
        errorCallback?.(true);
      } else {
        Toast.show(`${translate('toast.authFailed')}: ${e.message}`, {
          duration: Toast.durations.LONG,
        });
        // Increment failure count and set lockout if thresholds reached
        try {
          await LockoutUtils.recordFailure();
        } catch {}

        errorCallback?.();
      }
    }
  };

export const unlockWithPin =
  (pin: string, errorCallback?: (b?: boolean) => void): AppThunk =>
  async (dispatch) => {
    try {
      const isLocked = await LockoutUtils.checkActiveLockout();
      if (isLocked) {
        errorCallback?.();
        return;
      }

      const version = await StorageUtils.getAccountStorageVersion();

      if (version >= 3) {
        const isValid = await AuthUtils.verifyPin(pin);
        if (!isValid) {
          Toast.show(translate('toast.authFailed'), {
            duration: Toast.durations.LONG,
          });
          await LockoutUtils.recordFailure();
          errorCallback?.();
          return;
        }
        const masterKey = await AuthUtils.ensureMasterKey();
        await dispatch(unlock(masterKey, errorCallback));
        return;
      }

      let legacyAccounts: any = null;
      try {
        legacyAccounts = await StorageUtils.getAccounts(pin);
      } catch {}

      if (!legacyAccounts || !legacyAccounts.list) {
        const fallbackMasterKey =
          await StorageUtils.recoverFromFailedPinDecrypt(pin);
        if (fallbackMasterKey) {
          await dispatch(unlock(fallbackMasterKey, errorCallback));
          return;
        }

        Toast.show(translate('toast.authFailed'), {
          duration: Toast.durations.LONG,
        });
        await LockoutUtils.recordFailure();
        errorCallback?.();
        return;
      }

      const masterKey = await AuthUtils.ensureMasterKey();
      await AuthUtils.persistPinSecret(pin);
      await StorageUtils.migrateAccountsToV3(pin, masterKey, legacyAccounts);

      await dispatch(unlock(masterKey, errorCallback));
    } catch (e) {
      await LockoutUtils.recordFailure();
      errorCallback?.();
    }
  };

export const lock = () => {
  const action: ActionPayload<any> = {type: LOCK};
  return action;
};

export * from 'actions/accounts';
export * from 'actions/accountValueDisplay';
export * from 'actions/browser';
export * from 'actions/colors';
export * from 'actions/hive';
export * from 'actions/hive-uri';
export * from 'actions/hiveEngine';
export * from 'actions/rpc-switcher';
export * from 'actions/settings';
