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
