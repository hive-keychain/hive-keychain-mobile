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
  FETCH_DELEGATORS,
  FETCH_DELEGATEES,
  LOAD_TOKENS,
  LOAD_USER_TOKENS,
  LOAD_TOKENS_MARKET,
  LOAD_TOKEN_HISTORY,
} from './types';
import {encryptJson, decryptToJson} from 'utils/encrypt';
import {navigate} from 'utils/navigation';
import {translate} from 'utils/localize';
import {client} from 'utils/dhive';
import {saveOnKeychain, getFromKeychain} from 'utils/keychainStorage';
import {getBittrexPrices} from 'utils/price';
import {getDelegatees, getDelegators} from 'utils/hiveUtils';
import hsc, {hiveEngineAPI} from 'api/hiveEngine';

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
  } catch (e) {
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

export const loadAccount = (name) => async (dispatch, getState) => {
  console.log('plop');
  dispatch({
    type: ACTIVE_ACCOUNT,
    payload: {
      name,
    },
  });
  dispatch(getAccountRC(name));
  const account = (await client.database.getAccounts([name]))[0];
  const keys = getState().accounts.find((e) => e.name === name).keys;
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
    dispatch({
      type: GET_BITTREX_PRICE,
      payload: prices,
    });
  } catch (e) {
    console.log(e);
  }
};

export const initAccountTransactions = (accountName) => async (dispatch) => {
  const transfers = await getAccountTransactions(accountName);
  dispatch({
    type: INIT_TRANSACTIONS,
    payload: transfers,
  });
};

export const fetchAccountTransactions = (accountName, start) => async (
  dispatch,
) => {
  const transfers = await getAccountTransactions(accountName, start);
  dispatch({
    type: ADD_TRANSACTIONS,
    payload: transfers,
  });
};

const getAccountTransactions = async (accountName, start) => {
  const transactions = await client.call(
    'condenser_api',
    'get_account_history',
    [accountName, start || -1, start ? Math.min(500, start) : 500],
  );
  const transfers = transactions
    .filter((e) => e[1].op[0] === 'transfer')
    .map((e) => {
      return {
        ...e[1].op[1],
        type: 'transfer',
        timestamp: e[1].timestamp,
        key: `${accountName}!${e[0]}`,
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (start && Math.min(500, start) !== 500) {
    transfers[transfers.length - 1].last = true;
  }
  return transfers;
};

export const loadDelegators = (username) => async (dispatch) => {
  dispatch({
    type: FETCH_DELEGATORS,
    payload: await getDelegators(username),
  });
};

export const loadDelegatees = (username) => async (dispatch) => {
  dispatch({
    type: FETCH_DELEGATEES,
    payload: await getDelegatees(username),
  });
};

export const loadTokens = () => async (dispatch) => {
  dispatch({
    type: LOAD_TOKENS,
    payload: await hsc.find('tokens', 'tokens', {}, 1000, 0, []),
  });
};

export const loadTokensMarket = () => async (dispatch) => {
  dispatch({
    type: LOAD_TOKENS_MARKET,
    payload: await hsc.find('market', 'metrics', {}, 1000, 0, []),
  });
};

export const loadUserTokens = (account) => async (dispatch) => {
  const tokensBalance = (await hsc.find('tokens', 'balances', {account}))
    .filter((t) => parseFloat(t.balance) !== 0)
    .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
  console.log(tokensBalance);
  dispatch({
    type: LOAD_USER_TOKENS,
    payload: tokensBalance,
  });
};

export const loadTokenHistory = (account, currency) => async (dispatch) => {
  const tokenHistory = (
    await hiveEngineAPI.get('accountHistory', {
      params: {account, symbol: currency, type: 'user'},
    })
  ).data.map((e) => {
    e.amount = `${e.quantity} ${e.symbol}`;
    return e;
  });
  dispatch({type: LOAD_TOKEN_HISTORY, payload: tokenHistory});
};
