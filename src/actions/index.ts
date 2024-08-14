import Toast from 'react-native-simple-toast';
import BackGroundUtils from 'src/background';
import {AppThunk} from 'src/hooks/redux';
import {decryptToJson} from 'utils/encrypt';
import {getFromKeychain} from 'utils/keychainStorage';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {AccountsPayload, ActionPayload, NullableString} from './interfaces';
import {INIT_ACCOUNTS, LOCK, SIGN_UP, UNLOCK} from './types';

export const signUp = (pwd: string) => {
  navigate('ChooseAccountOptionsScreen');
  const action: ActionPayload<NullableString> = {type: SIGN_UP, payload: pwd};
  return action;
};

export const unlock = (
  mk: string,
  errorCallback?: (b?: boolean) => void,
): AppThunk => async (dispatch, getState) => {
  try {
    const accountsEncrypted = await getFromKeychain('accounts');
    const accounts = decryptToJson(accountsEncrypted, mk);
    if (accounts && accounts.list) {
      const unlock: ActionPayload<NullableString> = {type: UNLOCK, payload: mk};
      dispatch(unlock);
      const init: ActionPayload<AccountsPayload> = {
        type: INIT_ACCOUNTS,
        payload: {accounts: accounts.list},
      };
      dispatch(init);
      BackGroundUtils.init();
    }
    if (getState().browser.shouldFocus) {
      navigate('BrowserScreen');
    }
  } catch (e) {
    if (e.message === 'Wrapped error: User not authenticated') {
      errorCallback(true);
    } else {
      Toast.show(`${translate('toast.authFailed')}: ${e.message}`, Toast.LONG);
      console.log(e.message);
      errorCallback();
    }
  }
};

export const lock = () => {
  const action: ActionPayload<any> = {type: LOCK};
  return action;
};

export * from 'actions/accountValueDisplay';
export * from 'actions/accounts';
export * from 'actions/browser';
export * from 'actions/colors';
export * from 'actions/hive';
export * from 'actions/hive-uri';
export * from 'actions/hiveEngine';
export * from 'actions/rpc-switcher';
export * from 'actions/settings';
