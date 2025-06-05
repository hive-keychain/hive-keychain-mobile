import {TokenBalance, TokenTransaction} from 'actions/interfaces';
import {HiveEngineApi} from 'api/hiveEngine';
import {ReceiveTransferProps} from 'navigators/Root.types';
import {Token, TokenMarket} from 'src/interfaces/tokens.interface';

export interface TransactionConfirmationResult {
  confirmed: boolean;
  error: any;
}

const tryConfirmTransaction = (
  trxId: string,
): Promise<TransactionConfirmationResult> => {
  let result: any;
  return new Promise(async function (fulfill, reject) {
    for (let i = 0; i < 20; i++) {
      result = await BlockchainTransactionUtils.getDelayedTransactionInfo(
        trxId,
      );
      if (result != null) break;
    }

    var error = null;
    if (result && result.logs) {
      var logs = JSON.parse(result.logs);

      if (logs.errors && logs.errors.length > 0) error = logs.errors[0];
    }

    fulfill({confirmed: result != null, error: error});
  });
};

const getDelayedTransactionInfo = (trxID: string) => {
  return new Promise(function (fulfill, reject) {
    setTimeout(async function () {
      fulfill(HiveEngineApi.getSSC().getTransactionInfo(trxID));
    }, 1000);
  });
};
/* istanbul ignore next */
const delayRefresh = async (): Promise<void> => {
  const TIME_REFERENCE = 1643236071000;
  const delay = Math.min(
    ((Date.now() - TIME_REFERENCE) % 3) * 1000 + 100,
    3000,
  );
  return new Promise(function (fulfill, reject) {
    setTimeout(() => {
      fulfill();
    }, delay);
  });
};

export const getUserBalance = (account: string) => {
  return HiveEngineApi.get<TokenBalance[]>({
    contract: 'tokens',
    table: 'balances',
    query: {account: account},
    indexes: [],
    limit: 1000,
    offset: 0,
  });
};

export const getAllTokens = async (): Promise<Token[]> => {
  let tokens = [];
  let offset = 0;
  do {
    const newTokens = await getTokens(offset);
    tokens.push(...newTokens);
    offset += 1000;
  } while (tokens.length % 1000 === 0);
  return tokens;
};

const getTokens = async (offset: number) => {
  return (
    await HiveEngineApi.get<any[]>({
      contract: 'tokens',
      table: 'tokens',
      query: {},
      limit: 1000,
      offset: offset,
      indexes: [],
    })
  ).map((t: any) => {
    return {
      ...t,
      metadata: JSON.parse(t.metadata),
    };
  });
};

export const getTokenInfo = async (symbol: string): Promise<Token> => {
  return (
    await HiveEngineApi.get<any[]>({
      contract: 'tokens',
      table: 'tokens',
      query: {symbol: symbol},
      limit: 1000,
      offset: 0,
      indexes: [],
    })
  ).map((t: any) => {
    return {
      ...t,
      metadata: JSON.parse(t.metadata),
    };
  })[0];
};

export const getTokenPrecision = async (symbol: string) => {
  if (symbol === 'HBD' || symbol === 'HIVE') {
    return 3;
  }
  const token = await getTokenInfo(symbol);
  return token.precision;
};

export const getHiveEngineTokenPrice = (
  {symbol}: Partial<TokenBalance>,
  market: TokenMarket[],
) => {
  const tokenMarket = market.find((t) => t.symbol === symbol);
  const price = tokenMarket
    ? parseFloat(tokenMarket.lastPrice)
    : symbol === 'SWAP.HIVE'
    ? 1
    : 0;
  return price;
};

const searchForTransaction = async (
  params: ReceiveTransferProps,
  date: Date,
) => {
  let result: TokenTransaction[] = (
    await HiveEngineApi.getHistoryApi().get('accountHistory', {
      params: {
        account: params[1].to,
        symbol: (params[1].amount as string).split(' ')[1],
        type: 'user',
        offset: 0,
        limit: 1,
      },
    })
  ).data;
  return result.find((transaction) => {
    return (
      transaction.timestamp * 1000 > date.getTime() &&
      transaction.quantity === (params[1].amount as string).split(' ')[0] &&
      (transaction.memo || '') === params[1].memo
    );
  });
};

export const TokenUtils = {searchForTransaction};
export const BlockchainTransactionUtils = {
  tryConfirmTransaction,
  delayRefresh,
  getDelayedTransactionInfo,
};
