import api from 'api/keychain';
import {toHP} from 'utils/format';

export const getBittrexPrices = async () => {
  return (await api.get('/hive/v2/bittrex')).data;
};

export const getAccountValue = (
  {hbd_balance, balance, vesting_shares},
  {hive, hbd},
  props,
) => {
  return (
    parseFloat(hbd_balance) * hbd.Usd +
    (toHP(vesting_shares, props) + parseFloat(balance)) * hive.Usd
  ).toFixed(3);
};
