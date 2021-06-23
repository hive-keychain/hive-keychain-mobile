import {decodeMemo} from 'components/bridge';
import {AppThunk} from 'src/hooks/redux';
import dhive, {getClient} from 'utils/hive';
import {
  getConversionRequests,
  getDelegatees,
  getDelegators,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {getBittrexPrices} from 'utils/price';
import {getPhishingAccounts} from 'utils/transferValidator';
import {
  actionPayload,
  delegationsPayload,
  globalProperties,
  transaction,
} from './interfaces';
import {
  ACTIVE_ACCOUNT,
  ACTIVE_ACCOUNT_RC,
  ADD_TRANSACTIONS,
  FETCH_CONVERSION_REQUESTS,
  FETCH_DELEGATEES,
  FETCH_DELEGATORS,
  FETCH_PHISHING_ACCOUNTS,
  GET_BITTREX_PRICE,
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
  const rc = await getClient().rc.getRCMana(username);
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
  const action: actionPayload<globalProperties> = {
    type: GLOBAL_PROPS,
    payload: props,
  };
  dispatch(action);
};

export const loadBittrex = (): AppThunk => async (dispatch) => {
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

export const initAccountTransactions = (
  accountName: string,
): AppThunk => async (dispatch, getState) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName)!.keys
    .memo;
  const transfers = await getAccountTransactions(accountName, null, memoKey);

  dispatch({
    type: INIT_TRANSACTIONS,
    payload: transfers,
  });
};

export const fetchAccountTransactions = (
  accountName: string,
  start: number,
): AppThunk => async (dispatch, getState) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName)!.keys
    .memo;
  const transfers = await getAccountTransactions(accountName, start, memoKey);
  dispatch({
    type: ADD_TRANSACTIONS,
    payload: transfers,
  });
};

const getAccountTransactions = async (
  accountName: string,
  start: number | null,
  memoKey?: string,
): Promise<transaction[]> => {
  try {
    const op = dhive.utils.operationOrders;
    const operationsBitmask = dhive.utils.makeBitMaskFilter([op.transfer]);
    const transactions = await getClient().database.getAccountHistory(
      accountName,
      start || -1,
      start ? Math.min(10, start) : 1000,
      //@ts-ignore
      operationsBitmask,
    );
    const transfers = transactions
      .filter((e) => e[1].op[0] === 'transfer')
      .map((e) => {
        const receivedTransaction = e[1].op[1];
        //@ts-ignore
        const tr: transaction = {
          ...receivedTransaction,
          type: 'transfer',
          timestamp: e[1].timestamp,
          key: `${accountName}!${e[0]}`,
        };
        return tr;
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    console.log(transfers);

    if (start && Math.min(1000, start) !== 1000 && transfers.length) {
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
    console.log(e);
    return getAccountTransactions(
      accountName,
      e.jse_info.stack[0].data.sequence - 1,
      memoKey,
    );
  }
};

export const loadDelegators = (username: string): AppThunk => async (
  dispatch,
) => {
  const action: actionPayload<delegationsPayload> = {
    type: FETCH_DELEGATORS,
    payload: {incoming: await getDelegators(username)},
  };
  dispatch(action);
};

export const loadDelegatees = (username: string): AppThunk => async (
  dispatch,
) => {
  const action: actionPayload<delegationsPayload> = {
    type: FETCH_DELEGATEES,
    payload: {outgoing: await getDelegatees(username)},
  };
  dispatch(action);
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
  dispatch({
    type: FETCH_CONVERSION_REQUESTS,
    payload: await getConversionRequests(name),
  });
};
