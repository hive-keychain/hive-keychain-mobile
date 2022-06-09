import {TokenBalance, TokenMarket} from 'actions/interfaces';
import hsc from 'api/hiveEngine';
type sscjsResult = {logs: string};

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
      fulfill(hsc.getTransactionInfo(trxID));
    }, 1000);
  });
};

export const getHiveEngineTokenValue = (
  balance: TokenBalance,
  market: TokenMarket[],
) => {
  const tokenMarket = market.find((t) => t.symbol === balance.symbol);
  const price = tokenMarket
    ? parseFloat(tokenMarket.lastPrice)
    : balance.symbol === 'SWAP.HIVE'
    ? 1
    : 0;
  return parseFloat(balance.balance) * price;
};
