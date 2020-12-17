import {
  ACTIVE_ACCOUNT,
  GLOBAL_PROPS,
  ACTIVE_ACCOUNT_RC,
  GET_BITTREX_PRICE,
  INIT_TRANSACTIONS,
  ADD_TRANSACTIONS,
  FETCH_DELEGATORS,
  FETCH_DELEGATEES,
} from './types';
import dhive, {client} from 'utils/dhive';
import {getBittrexPrices} from 'utils/price';
import {getDelegatees, getDelegators} from 'utils/hiveUtils';

export const loadAccount = (name) => async (dispatch, getState) => {
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
    console.log('bittrex error', e);
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
  const op = dhive.utils.operationOrders;
  const operationsBitmask = dhive.utils.makeBitMaskFilter([op.transfer]);

  const transactions = await client.database.getAccountHistory(
    accountName,
    start || -1,
    start ? Math.min(1000, start) : 1000,
    operationsBitmask,
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
  if (start && Math.min(1000, start) !== 1000) {
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
