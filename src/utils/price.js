import api from 'api/keychain';
import {toHP, objectMap} from 'utils/format';

export const getBittrexPrices = async () => {
  const result = await api.get('https://api.steemkeychain.com/hive/bittrex');
  const prices = objectMap(result.data, (e) => e.result.Bid);
  prices.hiveUsd = prices.hive * prices.btc;
  prices.hbdUsd = prices.hbd * prices.btc;
  return prices;
};

export const getAccountValue = (
  {sbd_balance, balance, vesting_shares},
  {hiveUsd, hbdUsd},
  props,
) => {
  return (
    parseFloat(sbd_balance) * hbdUsd +
    (toHP(vesting_shares, props) + parseFloat(balance)) * hiveUsd
  ).toFixed(3);
};
