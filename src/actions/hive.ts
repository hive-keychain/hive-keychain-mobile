import {utils as dHiveUtils} from '@hiveio/dhive';
import {decodeMemo} from 'components/bridge';
import {AppThunk} from 'src/hooks/redux';
import {
  ClaimReward,
  FillRecurrentTransfer,
  RecurrentTransfer,
  Transaction,
  Transfer,
} from 'src/interfaces/transaction.interface';
import {store} from 'store';
import {getSymbol, toHP} from 'utils/format';
import {getClient} from 'utils/hive';
import {
  getConversionRequests,
  getDelegatees,
  getDelegators,
  getSavingsRequests,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {getPrices} from 'utils/price';
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

export const initAccountTransactions = (
  accountName: string,
): AppThunk => async (dispatch, getState) => {
  const memoKey = getState().accounts.find((a) => a.name === accountName)!.keys
    .memo;
  const transactions = await getAccountTransactions(accountName, null, memoKey);
  console.log({transactions}); //TODO to remove
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
): Promise<Transaction[]> => {
  try {
    const op = dHiveUtils.operationOrders;
    const operationsBitmask = dHiveUtils.makeBitMaskFilter([
      op.transfer,
      op.recurrent_transfer,
      op.fill_recurrent_transfer,
      op.claim_reward_balance,
    ]) as [number, number];
    const transactions = await getClient().database.getAccountHistory(
      accountName,
      start || -1,
      start ? Math.min(10, start) : 1000,
      //@ts-ignore
      operationsBitmask,
    );
    console.log('rawTransactions: '); //TODO to remove
    console.log({transactions}); //TODO to remove
    const transfers = transactions
      //.filter((e) => e[1].op[0] === 'transfer')
      .map((e) => {
        let specificTransaction = null;
        switch (e[1].op[0]) {
          case 'transfer': {
            specificTransaction = e[1].op[1] as Transfer;
            break;
          }
          case 'recurrent_transfer': {
            specificTransaction = e[1].op[1] as RecurrentTransfer;
            break;
          }
          case 'fill_recurrent_transfer': {
            const amtObj = e[1].op[1].amount;
            const amt =
              typeof amtObj === 'object'
                ? parseFloat(amtObj.amount) / 100
                : parseFloat(amtObj.split(' ')[0]);
            const currency =
              typeof amtObj === 'object'
                ? getSymbol(amtObj.nai)
                : amtObj.split(' ')[1];
            let amount = `${amt} ${currency}`;

            specificTransaction = e[1].op[1] as FillRecurrentTransfer;
            specificTransaction.amount = amount;
            specificTransaction.remainingExecutions =
              e[1].op[1].remaining_executions;
            break;
          }
          case 'claim_reward_balance': {
            specificTransaction = e[1].op[1] as ClaimReward;
            specificTransaction.hbd = e[1].op[1].reward_hbd;
            specificTransaction.hive = e[1].op[1].reward_hive;
            specificTransaction.hp = `${toHP(
              e[1].op[1].reward_vests,
              store.getState().globalProperties.globals,
            ).toFixed(3)} HP`;
            break;
          }
        }

        const tr: Transaction = {
          ...specificTransaction,
          type: specificTransaction!.type ?? e[1].op[0],
          timestamp: e[1].timestamp,
          key: `${accountName}!${e[0]}`,
          index: e[0],
          txId: e[1].trx_id,
          blockNumber: e[1].block,
          url:
            e[1].trx_id === '0000000000000000000000000000000000000000'
              ? `https://hiveblocks.com/b/${e[1].block}#${e[1].trx_id}`
              : `https://hiveblocks.com/tx/${e[1].trx_id}`,
          last: false,
          lastFetched: false,
        };
        return tr;
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    if (start && Math.min(1000, start) !== 1000 && transfers.length) {
      transfers[transfers.length - 1].last = true;
    }
    const trs = [];
    for (const transfer of transfers.filter(
      (tr) =>
        tr.type === 'transfer' ||
        tr.type === 'recurrent_transfer' ||
        tr.type === 'fill_recurrent_transfer',
    )) {
      const {memo} = transfer as
        | Transfer
        | RecurrentTransfer
        | FillRecurrentTransfer;
      if (memo[0] === '#') {
        if (memoKey) {
          try {
            //@ts-ignore
            transfer.memo = await decodeMemo(memoKey, memo);
          } catch (e) {}
        } else {
          //@ts-ignore
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
      (e as any).jse_info.stack[0].data.sequence - 1,
      memoKey,
    );
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
