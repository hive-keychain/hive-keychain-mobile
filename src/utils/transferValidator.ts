import {cryptoUtils} from '@hiveio/dhive';
import api from 'api/keychain';
import {translate} from 'utils/localize';
import {getPublicKeyFromPrivateKeyString} from './keyValidation';

const getExchanges = () => [
  {account: 'bittrex', tokens: ['HIVE', 'HBD']},
  {account: 'deepcrypto8', tokens: ['HIVE']},
  {account: 'binance-hot', tokens: []},
  {account: 'ionomy', tokens: ['HIVE', 'HBD']},
  {account: 'huobi-pro', tokens: ['HIVE']},
  {account: 'huobi-withdrawal', tokens: []},
  {account: 'blocktrades', tokens: ['HIVE', 'HBD']},
  {account: 'mxchive', tokens: ['HIVE']},
  {account: 'hot.dunamu', tokens: []},
  {account: 'probithive', tokens: ['HIVE']},
  {account: 'probitred', tokens: []},
  {account: 'upbitsteem', tokens: []},
];

const getExchangeValidationWarning = (
  account: string,
  currency: string,
  hasMemo: boolean,
): string | null => {
  const exchanges = getExchanges();
  const exchange = exchanges.find((e) => e.account === account);
  if (!exchange) {
    return null;
  }
  if (!exchange.tokens.includes(currency)) {
    return translate('wallet.operations.transfer.warning.exchange_currency', {
      currency,
    });
  }
  if (!hasMemo) {
    return translate('wallet.operations.transfer.warning.exchange_memo');
  }
  return null;
};

export const getTransferWarning = (
  phishingAccounts: string[],
  account: string,
  currency: string,
  hasMemo: boolean,
  memo?: string,
) => {
  let warning = null;

  warning = getExchangeValidationWarning(account, currency, hasMemo);

  if (memo) warning = getPrivateKeysMemoValidationWarning(memo);

  if (phishingAccounts.find((e) => e === account))
    warning = translate('wallet.operations.transfer.warning.phishing');

  return {
    warning,
    exchange: !warning && !!getExchanges().find((e) => e.account === account),
  };
};

const getPrivateKeysMemoValidationWarning = (memo: string): string | null => {
  let memoTemp: string = memo.startsWith('#')
    ? memo.substring(1, memo.length)
    : memo;
  let found: RegExpMatchArray | null;
  found = memoTemp.match(/[\w\d]{51,52}/g);
  if (found) {
    for (const word of found) {
      if (cryptoUtils.isWif(word) && word.length === 51) {
        if (getPublicKeyFromPrivateKeyString(word))
          return translate('keys.warning_private_key_in_memo');
      } else if (word.startsWith('P') && word.length === 52) {
        return translate('keys.warning_private_key_in_memo');
      }
    }
  }
  return null;
};

export const getPhishingAccounts = async () => {
  return (await api.get('/hive/phishingAccounts')).data;
};
