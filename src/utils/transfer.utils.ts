import {
  TransferUtils as TransferUtilsCommons,
  TransferWarning,
} from 'hive-keychain-commons';
import {PendingRecurrentTransfer} from 'src/interfaces/transaction.interface';
import {translate} from 'utils/localize';
import {getData} from './hiveLibs.utils';

const getTransferWarningLabel = (
  account: string,
  currency: string,
  memo: any,
  phisingAccounts: any,
  isRecurrent?: boolean,
  isOnVsc?: boolean,
) => {
  const warning = TransferUtilsCommons.getTransferWarning(
    account,
    currency,
    memo,
    phisingAccounts,
    isRecurrent,
    isOnVsc,
  );

  switch (warning) {
    case TransferWarning.PHISHING:
      return translate('wallet.operations.transfer.warning.phishing');
    case TransferWarning.EXCHANGE_MEMO:
      return translate('wallet.operations.transfer.warning.exchange_memo');
    case TransferWarning.EXCHANGE_RECURRENT:
      return translate('wallet.operations.transfer.warning.exchange_recurrent');
    case TransferWarning.EXCHANGE_DEPOSIT:
      return translate('wallet.operations.transfer.warning.exchange_currency', {
        currency,
      });
    case TransferWarning.PRIVATE_KEY_IN_MEMO:
      return translate(
        'wallet.operations.transfer.warning.private_key_in_memo',
      );
    case TransferWarning.EXCHANGE_VSC:
      return translate('wallet.operations.transfer.warning.exchange_vsc');
    default:
      return;
  }
};

const getRecurrentTransfers = async (
  name: string,
): Promise<{recurrent_transfers: PendingRecurrentTransfer[]}> => {
  const recurrentTransfers = await getData(
    'database_api.find_recurrent_transfers',
    {from: name},
  );
  return recurrentTransfers;
};

const getRecurrentTransferPairId = (
  recurrentTransfers: PendingRecurrentTransfer[],
  to: string,
): number => {
  const pairTrx = recurrentTransfers.filter((transfer) => transfer.to === to);
  if (pairTrx.length === 0) return 0;
  const pairId = pairTrx.reduce(
    (max: number, transfer: PendingRecurrentTransfer) => {
      return max === 0 || transfer.pair_id > max ? transfer.pair_id : max;
    },
    0,
  );
  return pairId + 1;
};

export const TransferUtils = {
  getTransferWarningLabel,
  getRecurrentTransfers,
  getRecurrentTransferPairId,
};
