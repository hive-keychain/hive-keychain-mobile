import {
  TransferUtils as TransferUtilsCommons,
  TransferWarning,
} from 'hive-keychain-commons';
import {translate} from 'utils/localize';

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

export const TransferUtils = {
  getTransferWarningLabel,
};
