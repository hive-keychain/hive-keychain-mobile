import {Token, TokenBalance, TokenMarket} from 'actions/interfaces';
import {HiveEngineApi} from 'api/hiveEngine';
import {decodeMemo} from 'components/bridge';
import {translate} from './localize';

type sscjsResult = {logs: string};

export interface TokenDelegation {
  from: string;
  quantity: string;
  symbol: string;
  to: string;
  created: number;
  updated: number;
}

export const tryConfirmTransaction = async (trxId: string) => {
  let result;
  for (let i = 0; i < 20; i++) {
    result = (await getDelayedTransactionInfo(trxId)) as sscjsResult;
    if (result) {
      break;
    }
  }
  var error = null;
  if (result && result.logs) {
    var logs = JSON.parse(result.logs);

    if (logs.errors && logs.errors.length > 0) {
      error = logs.errors[0];
    }
  }

  return {confirmed: !!result, error};
};

const getDelayedTransactionInfo = (trxID: string) => {
  return new Promise(function (fulfill) {
    setTimeout(async function () {
      fulfill(HiveEngineApi.getSSC().getTransactionInfo(trxID));
    }, 1000);
  });
};

export const getHiveEngineTokenValue = (
  balance: TokenBalance,
  market: TokenMarket[],
  minVolume = 0,
) => {
  if (balance.symbol === 'SWAP.HIVE') return parseFloat(balance.balance) * 1;
  const {price, volume} = getHiveEngineTokenTradingInfo(balance, market);
  const withVolumeAccounted =
    minVolume <= parseFloat(volume)
      ? (parseFloat(balance.balance) +
          parseFloat(balance.stake) +
          parseFloat(balance.pendingUnstake) +
          parseFloat(balance.pendingUndelegations) +
          parseFloat(balance.delegationsOut)) *
        price
      : 0;
  return withVolumeAccounted;
};

export const getHiveEngineTokenTradingInfo = (
  balance: TokenBalance,
  market: TokenMarket[],
) => {
  const tokenMarket = market.find((t) => t.symbol === balance.symbol);
  const price = tokenMarket
    ? parseFloat(tokenMarket.lastPrice)
    : balance.symbol === 'SWAP.HIVE'
    ? 1
    : 0;
  return {price, volume: tokenMarket?.volume};
};

export const decodeMemoIfNeeded = (memo: string, memoKey: string) => {
  if (memo && memo[0] === '#') {
    if (memoKey) {
      decodeMemo(memoKey, memo)
        .then((decoded) => {
          return decoded;
        })
        .catch((e) => {
          console.log('Error while decoding memo: ', e);
        });
    } else {
      return translate('wallet.add_memo');
    }
  }
  return memo;
};

export const getIncomingTokenDelegations = async (
  username: string,
  symbol: string,
): Promise<TokenDelegation[]> => {
  return HiveEngineApi.getSSC().find('tokens', 'delegations', {
    to: username,
    symbol: symbol,
  });
};

export const getOutgoingTokenDelegations = async (
  username: string,
  symbol: string,
): Promise<TokenDelegation[]> => {
  return HiveEngineApi.getSSC().find('tokens', 'delegations', {
    from: username,
    symbol: symbol,
  });
};

export const getAllTokens = async (): Promise<Token[]> => {
  return (
    await HiveEngineApi.getSSC().find('tokens', 'tokens', {}, 1000, 0, [])
  ).map((t: any) => {
    return {
      ...t,
      metadata: JSON.parse(t.metadata),
    };
  });
};

export const getTokenInfo = async (symbol: string): Promise<Token> => {
  return (
    await HiveEngineApi.getSSC().find(
      'tokens',
      'tokens',
      {symbol: symbol},
      1000,
      0,
      [],
    )
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
