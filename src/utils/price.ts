import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import {CurrencyPrices} from 'actions/interfaces';
import api from 'api/keychain';
import {toHP} from 'utils/format';

export const getPrices = async () => {
  return (await api.get('/hive/v2/price')).data;
};

export const getAccountValue = (
  {
    hbd_balance,
    balance,
    vesting_shares,
    savings_balance,
    savings_hbd_balance,
  }: ExtendedAccount,
  {hive, hive_dollar}: CurrencyPrices,
  props: DynamicGlobalProperties,
) => {
  if (!hive_dollar.usd || !hive.usd) return 0;
  return (
    (parseFloat(hbd_balance as string) +
      parseFloat(savings_hbd_balance as string)) *
      hive_dollar.usd +
    (toHP(vesting_shares as string, props) +
      parseFloat(balance as string) +
      parseFloat(savings_balance as string)) *
      hive.usd
  ).toFixed(3);
};
