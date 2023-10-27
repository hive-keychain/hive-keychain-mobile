import {AppThunk} from 'src/hooks/redux';
import AccountUtils from 'utils/account.utils';
import {getClient} from 'utils/hive';
import {
  getConversionRequests,
  getDelegatees,
  getDelegators,
  getSavingsRequests,
} from 'utils/hiveUtils';
import {getPrices} from 'utils/price';
import TransactionUtils from 'utils/transactions.utils';
import {getPhishingAccounts} from 'utils/transferValidator';
import {
  ActionPayload,
  DelegationsPayload,
  GlobalProperties,
} from './interfaces';
import {
  ACTIVE_ACCOUNT,
  ACTIVE_ACCOUNT_RC,
  ADD_TRANSACTIONS,
  CLEAR_USER_TRANSACTIONS,
  FETCH_CONVERSION_REQUESTS,
  FETCH_DELEGATEES,
  FETCH_DELEGATORS,
  FETCH_PHISHING_ACCOUNTS,
  FETCH_SAVINGS_REQUESTS,
  GET_CURRENCY_PRICES,
  GLOBAL_PROPS,
  INIT_TRANSACTIONS,
} from './types';

export const loadAccount = (
  name: string,
  initTransactions?: boolean,
): AppThunk => async (dispatch, getState) => {
  dispatch({
    type: ACTIVE_ACCOUNT,
    payload: {
      name,
    },
  });
  dispatch(getAccountRC(name));
  if (initTransactions) {
    dispatch(initAccountTransactions(name));
  }
  const account = (await getClient().database.getAccounts([name]))[0];
  const keys = getState().accounts.find((e) => e.name === name)!.keys;
  dispatch({
    type: ACTIVE_ACCOUNT,
    payload: {
      account,
      keys,
    },
  });
};

const getAccountRC = (username: string): AppThunk => async (dispatch) => {
  const rc = await AccountUtils.getRCMana(username);
  dispatch({
    type: ACTIVE_ACCOUNT_RC,
    payload: rc,
  });
};

export const loadProperties = (): AppThunk => async (dispatch) => {
  const [globals, price, rewardFund] = await Promise.all([
    getClient().database.getDynamicGlobalProperties(),
    getClient().database.getCurrentMedianHistoryPrice(),
    getClient().database.call('get_reward_fund', ['post']),
  ]);
  const props = {globals, price, rewardFund};
  const action: ActionPayload<GlobalProperties> = {
    type: GLOBAL_PROPS,
    payload: props,
  };
  dispatch(action);
};

export const loadPrices = (): AppThunk => async (dispatch) => {
  try {
    const prices = await getPrices();
    dispatch({
      type: GET_CURRENCY_PRICES,
      payload: prices,
    });
  } catch (e) {
    console.log('price error', e);
  }
};

export const clearUserTransactions = (): AppThunk => async (dispatch) => {
  dispatch({
    type: CLEAR_USER_TRANSACTIONS,
  });
};

export const initAccountTransactions = (
  accountName: string,
): AppThunk => async (dispatch, getState) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName)!.keys
    .memo;
  const transactions = await TransactionUtils.getAccountTransactions(
    accountName,
    null,
    getState().properties.globals!,
    memoKey,
  );
  dispatch({
    type: INIT_TRANSACTIONS,
    payload: transactions,
  });
};

export const fetchAccountTransactions = (
  accountName: string,
  start: number,
): AppThunk => async (dispatch, getState) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName)!.keys
    .memo;
  const transfers = await TransactionUtils.getAccountTransactions(
    accountName,
    start,
    getState().properties.globals!,
    memoKey,
  );
  if (transfers) {
    dispatch({
      type: ADD_TRANSACTIONS,
      payload: transfers,
    });
  }
};

export const loadDelegators = (username: string): AppThunk => async (
  dispatch,
) => {
  try {
    const action: ActionPayload<DelegationsPayload> = {
      type: FETCH_DELEGATORS,
      payload: {incoming: await getDelegators(username)},
    };
    dispatch(action);
  } catch (e) {
    console.log(e);
  }
};

export const loadDelegatees = (username: string): AppThunk => async (
  dispatch,
) => {
  try {
    const action: ActionPayload<DelegationsPayload> = {
      type: FETCH_DELEGATEES,
      payload: {outgoing: await getDelegatees(username)},
    };
    dispatch(action);
  } catch (e) {
    console.log(e);
  }
};

export const fetchPhishingAccounts = (): AppThunk => async (dispatch) => {
  dispatch({
    type: FETCH_PHISHING_ACCOUNTS,
    payload: await getPhishingAccounts(),
  });
};

export const fetchConversionRequests = (name: string): AppThunk => async (
  dispatch,
) => {
  const conversions = await getConversionRequests(name);
  dispatch({
    type: FETCH_CONVERSION_REQUESTS,
    payload: conversions,
  });
};

export const fetchSavingsRequests = (name: string): AppThunk => async (
  dispatch,
) => {
  const savings = await getSavingsRequests(name);
  dispatch({
    type: FETCH_SAVINGS_REQUESTS,
    payload: savings,
  });
};
