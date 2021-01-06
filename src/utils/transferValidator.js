import {translate} from 'utils/localize';

const getExchangeValidationWarning = (account, currency, hasMemo) => {
  const exchanges = [
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

export const validate = (phishingAccounts, account, currency, hasMemo) => {
  let warning = null;
  if (phishingAccounts.find(account)) {
    warning = translate('wallet.operations.transfer.warning.phishing');
  } else {
    warning = getExchangeValidationWarning(account, currency, hasMemo);
  }
  return warning;
};
