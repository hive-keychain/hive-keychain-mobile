import Toast from 'react-native-simple-toast';

import {
  SIGN_UP,
  ADD_ACCOUNT,
  FORGET_ACCOUNTS,
  LOCK,
  UNLOCK,
  INIT_ACCOUNTS,
  ACTIVE_ACCOUNT,
  GLOBAL_PROPS,
  ACTIVE_ACCOUNT_RC,
  GET_BITTREX_PRICE,
  INIT_TRANSACTIONS,
  ADD_TRANSACTIONS,
} from './types';
import {encryptJson, decryptToJson} from 'utils/encrypt';
import {navigate} from '../navigationRef';
import {translate} from 'utils/localize';
import {client} from 'utils/dhive';
import {saveOnKeychain, getFromKeychain} from 'utils/keychainStorage';
import {getBittrexPrices} from 'utils/price';

export const signUp = (pwd) => {
  navigate('AddAccountByKeyScreen');
  return {type: SIGN_UP, payload: pwd};
};

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
  console.log({type: ADD_ACCOUNT, payload: {name, keys}});
  dispatch({type: ADD_ACCOUNT, payload: {name, keys}});
  const accounts = [...previousAccounts, {name, keys}];
  const encrypted = encryptJson({list: accounts}, mk);
  await saveOnKeychain('accounts', encrypted);
  if (wallet) {
    navigate('WalletScreen');
  }
};

export const unlock = (mk, errorCallback) => async (dispatch, getState) => {
  try {
    const accountsEncrypted = await getFromKeychain('accounts');
    const accounts = decryptToJson(accountsEncrypted, mk);
    if (accounts && accounts.list) {
      dispatch({type: UNLOCK, payload: mk});
      dispatch({type: INIT_ACCOUNTS, payload: accounts.list});
    }
    console.log(INIT_ACCOUNTS);
  } catch (e) {
    console.log(e, e.message);
    if (e.message === 'Wrapped error: User not authenticated') {
      errorCallback(true);
    } else {
      Toast.show(translate('toast.authFailed'));
      errorCallback();
    }
  }
};

export const lock = () => {
  return {type: LOCK};
};

export const forgetAccounts = () => (dispatch, getState) => {
  //clearKeychain(getState());
  dispatch({
    type: FORGET_ACCOUNTS,
  });
};

export const loadAccount = (username) => async (dispatch, getState) => {
  dispatch(getAccountRC(username));
  const account = (await client.database.getAccounts([username]))[0];
  const keys = getState().accounts.find((e) => e.name === username).keys;
  dispatch({
    type: ACTIVE_ACCOUNT,
    payload: {
      account,
      keys,
    },
  });
};

const getAccountRC = (username) => async (dispatch) => {
  const rc = await client.rc.getRCMana(username);
  dispatch({
    type: ACTIVE_ACCOUNT_RC,
    payload: rc,
  });
};

export const loadProperties = () => async (dispatch) => {
  const [globals, price, rewardFund] = await Promise.all([
    client.database.getDynamicGlobalProperties(),
    client.database.getCurrentMedianHistoryPrice(),
    client.database.call('get_reward_fund', ['post']),
  ]);
  const props = {globals, price, rewardFund};
  dispatch({type: GLOBAL_PROPS, payload: props});
};

export const loadBittrex = () => async (dispatch) => {
  try {
    const prices = await getBittrexPrices();
    console.log(prices);
    dispatch({
      type: GET_BITTREX_PRICE,
      payload: prices,
    });
  } catch (e) {
    console.log(e);
  }
};

export const initAccountTransactions = (accountName) => async (dispatch) => {
  const transactions = await client.call(
    'condenser_api',
    'get_account_history',
    [accountName, -1, 500],
  );
  console.log(transactions);
  const transfers = transactions
    .filter((e) => e[1].op[0] === 'transfer')
    .map((e) => {
      return {
        ...e[1].op[1],
        type: 'transfer',
        timestamp: e[1].timestamp,
        key: accountName + e[1].trx_id + Math.floor(Math.random() * 100000),
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  console.log(transfers);
  dispatch({
    type: INIT_TRANSACTIONS,
    payload: transfers,
  });
};
