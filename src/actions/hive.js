import {
  ACTIVE_ACCOUNT,
  GLOBAL_PROPS,
  ACTIVE_ACCOUNT_RC,
  GET_BITTREX_PRICE,
  INIT_TRANSACTIONS,
  ADD_TRANSACTIONS,
  FETCH_DELEGATORS,
  FETCH_DELEGATEES,
  FETCH_PHISHING_ACCOUNTS,
  FETCH_CONVERSION_REQUESTS,
} from './types';
import dhive, {getClient} from 'utils/hive';
import {getBittrexPrices} from 'utils/price';
import {getPhishingAccounts} from 'utils/transferValidator';
import {getDelegatees, getDelegators} from 'utils/hiveUtils';
import {getConversionRequests} from 'utils/hiveUtils';
import {decodeMemo} from 'components/bridge';
import {translate} from 'utils/localize';

export const loadAccount = (name, initTransactions) => async (
  dispatch,
  getState,
) => {
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
  const rc = await getClient().rc.getRCMana(username);
  dispatch({
    type: ACTIVE_ACCOUNT_RC,
    payload: rc,
  });
};

export const loadProperties = () => async (dispatch) => {
  const [globals, price, rewardFund] = await Promise.all([
    getClient().database.getDynamicGlobalProperties(),
    getClient().database.getCurrentMedianHistoryPrice(),
    getClient().database.call('get_reward_fund', ['post']),
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

export const initAccountTransactions = (accountName) => async (
  dispatch,
  getState,
) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName).keys
    .memo;
  const transfers = await getAccountTransactions(accountName, null, memoKey);

  dispatch({
    type: INIT_TRANSACTIONS,
    payload: transfers,
  });
};

export const fetchAccountTransactions = (accountName, start) => async (
  dispatch,
  getState,
) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName).keys
    .memo;
  const transfers = await getAccountTransactions(accountName, start, memoKey);
  dispatch({
    type: ADD_TRANSACTIONS,
    payload: transfers,
  });
};

const getAccountTransactions = async (accountName, start, memoKey) => {
  const op = dhive.utils.operationOrders;
  const operationsBitmask = dhive.utils.makeBitMaskFilter([op.transfer]);
  try {
    const transactions = await getClient().database.getAccountHistory(
      accountName,
      start || -1,
      start ? Math.min(10, start) : 1000,
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
    const trs = [];
    for (const transfer of transfers) {
      const {memo} = transfer;
      if (memo[0] === '#') {
        if (memoKey) {
          try {
            transfer.memo = await decodeMemo(memoKey, memo);
          } catch (e) {}
        } else {
          transfer.memo = translate('wallet.add_memo');
        }
        trs.push(transfer);
      } else {
        trs.push(transfer);
      }
    }
    return trs;
  } catch (e) {
    return getAccountTransactions(
      accountName,
      e.jse_info.stack[0].data.sequence - 1,
      memoKey,
    );
  }
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

export const fetchPhishingAccounts = () => async (dispatch) => {
  dispatch({
    type: FETCH_PHISHING_ACCOUNTS,
    payload: await getPhishingAccounts(),
  });
};

export const fetchConversionRequests = (name) => async (dispatch) => {
  dispatch({
    type: FETCH_CONVERSION_REQUESTS,
    payload: await getConversionRequests(name),
  });
};
