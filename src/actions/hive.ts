import {utils as dHiveUtils} from '@hiveio/dhive';
import {decodeMemo} from 'components/bridge';
import {AppThunk} from 'src/hooks/redux';
import {
  ClaimAccount,
  ClaimReward,
  CollateralizedConvert,
  Convert,
  CreateAccount,
  CreateClaimedAccount,
  Delegation,
  DepositSavings,
  FillCollateralizedConvert,
  FillConvert,
  FillRecurrentTransfer,
  PowerDown,
  PowerUp,
  ReceivedInterests,
  RecurrentTransfer,
  StartWithdrawSavings,
  Transaction,
  Transfer,
  WithdrawSavings,
} from 'src/interfaces/transaction.interface';
import {RootState, store} from 'store';
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

const getAccountTransactions = async (
  accountName: string,
  start: number | null,
  memoKey?: string,
): Promise<Transaction[]> => {
  const {globals} = (store.getState() as RootState).properties;
  try {
    const op = dHiveUtils.operationOrders;
    const operationsBitmask = dHiveUtils.makeBitMaskFilter([
      op.transfer,
      op.recurrent_transfer,
      op.fill_recurrent_transfer,
      op.claim_reward_balance,
      op.delegate_vesting_shares,
      op.transfer_to_vesting,
      op.withdraw_vesting,
      op.interest,
      op.transfer_to_savings,
      op.transfer_from_savings,
      op.fill_transfer_from_savings,
      op.claim_account,
      op.convert,
      op.collateralized_convert,
      op.fill_convert_request,
      op.fill_collateralized_convert_request,
      op.create_claimed_account,
      op.account_create,
    ]) as [number, number];
    const transactions = await getClient().database.getAccountHistory(
      accountName,
      start || -1,
      start ? Math.min(10, start) : 1000,
      operationsBitmask,
    );

    const availableTransactions = transactions
      .map((e) => {
        let specificTransaction = null;
        switch (e[1].op[0]) {
          case 'transfer': {
            specificTransaction = e[1].op[1] as Transfer;
            specificTransaction = decodeMemoIfNeeded(
              specificTransaction,
              memoKey,
            );
            break;
          }
          case 'recurrent_transfer': {
            specificTransaction = e[1].op[1] as RecurrentTransfer;
            specificTransaction = decodeMemoIfNeeded(
              specificTransaction,
              memoKey,
            );
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
            specificTransaction = decodeMemoIfNeeded(
              specificTransaction,
              memoKey,
            );
            break;
          }
          case 'claim_reward_balance': {
            specificTransaction = e[1].op[1] as ClaimReward;
            specificTransaction.hbd = e[1].op[1].reward_hbd;
            specificTransaction.hive = e[1].op[1].reward_hive;
            specificTransaction.hp = `${toHP(
              e[1].op[1].reward_vests,
              globals,
            ).toFixed(3)} HP`;
            break;
          }
          case 'delegate_vesting_shares': {
            specificTransaction = e[1].op[1] as Delegation;
            specificTransaction.amount = `${toHP(
              e[1].op[1].vesting_shares,
              globals,
            ).toFixed(3)} HP`;
            break;
          }
          case 'transfer_to_vesting': {
            specificTransaction = e[1].op[1] as PowerUp;
            specificTransaction.type = 'power_up_down';
            specificTransaction.subType = 'transfer_to_vesting';
            break;
          }
          case 'withdraw_vesting': {
            specificTransaction = e[1].op[1] as PowerDown;
            specificTransaction.type = 'power_up_down';
            specificTransaction.subType = 'withdraw_vesting';
            specificTransaction.amount = `${toHP(
              e[1].op[1].vesting_shares,
              globals,
            ).toFixed(3)} HP`;
            break;
          }
          case 'interest': {
            specificTransaction = e[1].op[1] as ReceivedInterests;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'interest';
            break;
          }
          case 'transfer_to_savings': {
            specificTransaction = e[1].op[1] as DepositSavings;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'transfer_to_savings';
            break;
          }
          case 'transfer_from_savings': {
            specificTransaction = e[1].op[1] as StartWithdrawSavings;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'transfer_from_savings';
            break;
          }
          case 'fill_transfer_from_savings': {
            specificTransaction = e[1].op[1] as WithdrawSavings;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'fill_transfer_from_savings';
            break;
          }
          case 'claim_account': {
            specificTransaction = e[1].op[1] as ClaimAccount;
            break;
          }
          case 'convert': {
            specificTransaction = e[1].op[1] as Convert;
            specificTransaction.type = 'convert';
            specificTransaction.subType = 'convert';
            break;
          }
          case 'collateralized_convert': {
            specificTransaction = e[1].op[1] as CollateralizedConvert;
            specificTransaction.type = 'convert';
            specificTransaction.subType = 'collateralized_convert';
            break;
          }
          case 'fill_convert_request': {
            specificTransaction = e[1].op[1] as FillConvert;
            specificTransaction.type = 'convert';
            specificTransaction.subType = 'fill_convert_request';
            break;
          }
          case 'fill_collateralized_convert_request': {
            specificTransaction = e[1].op[1] as FillCollateralizedConvert;
            specificTransaction.type = 'convert';
            specificTransaction.subType = 'fill_collateralized_convert_request';
            break;
          }
          case 'create_claimed_account': {
            specificTransaction = e[1].op[1] as CreateClaimedAccount;
            break;
          }
          case 'account_create': {
            specificTransaction = e[1].op[1] as CreateAccount;
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

    if (
      start &&
      Math.min(1000, start) !== 1000 &&
      availableTransactions.length
    ) {
      availableTransactions[availableTransactions.length - 1].last = true;
    }
    return availableTransactions;
  } catch (e) {
    return getAccountTransactions(
      accountName,
      (e as any).jse_info.stack[0].data.sequence - 1,
      memoKey,
    );
  }
};

const decodeMemoIfNeeded = (transfer: Transfer, memoKey: string) => {
  const {memo} = transfer;
  if (memo[0] === '#') {
    if (memoKey) {
      decodeMemo(memoKey, memo)
        .then((decoded) => {
          transfer.memo = decoded;
          return transfer;
        })
        .catch((e) => {
          console.log('Error while decoding memo: ', e);
        });
    } else {
      transfer.memo = translate('wallet.add_memo');
    }
  }
  return transfer;
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
