import Toast from 'react-native-simple-toast';

import {SIGN_UP, LOCK, UNLOCK, INIT_ACCOUNTS} from './types';
import {decryptToJson} from 'utils/encrypt';
import {navigate} from 'utils/navigation';
import {translate} from 'utils/localize';
import {getFromKeychain} from 'utils/keychainStorage';

export const signUp = (pwd) => {
  navigate('AddAccountByKeyScreen');
  return {type: SIGN_UP, payload: pwd};
};

export const unlock = (mk, errorCallback) => async (dispatch, getState) => {
  try {
    const accountsEncrypted = await getFromKeychain('accounts');
    const accounts = decryptToJson(accountsEncrypted, mk);
    if (accounts && accounts.list) {
      dispatch({type: UNLOCK, payload: mk});
      dispatch({type: INIT_ACCOUNTS, payload: accounts.list});
    }
    if (getState().browser.shouldFocus) {
      navigate('BrowserScreen');
    }
  } catch (e) {
    if (e.message === 'Wrapped error: User not authenticated') {
      errorCallback(true);
    } else {
      Toast.show(`${translate('toast.authFailed')}: ${e.message}`);
      errorCallback();
    }
  }
};

export const lock = () => {
  return {type: LOCK};
};

export * from 'actions/accounts';
export * from 'actions/hive';
export * from 'actions/hiveEngine';
export * from 'actions/settings';
export * from 'actions/browser';
