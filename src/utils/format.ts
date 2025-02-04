import {Asset, DynamicGlobalProperties} from '@hiveio/dhive';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import {HiveErrorMessage} from 'hive-keychain-commons';
import {translate} from 'utils/localize';

export const withCommas = (nb: string, decimals = 3) =>
  parseFloat(parseFloat(nb).toFixed(decimals))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const toHP = (vests: string, props?: DynamicGlobalProperties) =>
  props
    ? (parseFloat(vests) * parseFloat(props.total_vesting_fund_hive + '')) /
      parseFloat(props.total_vesting_shares + '')
    : 0;

export const getUSDFromVests = (
  vestAmount: Number,
  globalProperties: GlobalProperties,
  currencyPrices: CurrencyPrices,
) => {
  return (
    toHP(vestAmount.toString(), globalProperties.globals!) *
    currencyPrices.hive.usd!
  ).toFixed(2);
};

export const fromHP = (hp: string, props: DynamicGlobalProperties) =>
  (parseFloat(hp) / parseFloat(props.total_vesting_fund_hive + '')) *
  parseFloat(props.total_vesting_shares + '');

export const chunkArray = (myArray: any[], chunk_size: number) => {
  const arrayLength = myArray.length;
  let tempArray = [];

  for (let index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
};

export const signedNumber = (nb: number) =>
  nb > 0 ? `+ ${nb}` : `${nb.toString().replace('-', '- ')}`;

export const formatBalance = (balance: number) =>
  balance > 1000 || balance < -1000
    ? withCommas(balance + '', 0)
    : withCommas(balance + '');

export const formatBalanceCurrency = (balanceS: string) => {
  const balance = Number(balanceS.split(' ')[0].replace(/,/g, ''));
  const currency = balanceS.split(' ')[1];
  return `${formatBalance(balance)} ${currency ?? ''}`;
};

export const getCleanAmountValue = (numberWithComma: string) => {
  return numberWithComma.split(' ')[0].replace(/,/g, '');
};

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const wordsFromCamelCase = (sentence: string) => {
  return sentence.split(/(?=[A-Z])/).join(' ');
};

export const beautifyTransferError = (
  err: HiveErrorMessage,
  {currency, username, to}: {currency?: string; username?: string; to?: string},
) => {
  if (!err.data && err.message.includes('Unable to serialize')) {
    return translate('request.error.transfer.encrypt');
  }
  switch (err?.data?.stack?.[0]?.context?.method) {
    case 'adjust_balance':
      return translate('request.error.transfer.adjust_balance', {
        currency,
        username,
      });
    case 'get_account':
      return translate('request.error.transfer.get_account', {to});
    default:
      return translate('request.error.broadcasting');
  }
};

export const getSymbol = (nai: string) => {
  if (nai === '@@000000013') return 'HBD';
  if (nai === '@@000000021') return 'HIVE';
  if (nai === '@@000000037') return 'HP';
};

export const getAmountFromNai = (obj: any) => {
  const res = fromNaiAndSymbol(obj);
  return Asset.fromString(res).amount;
};

export const toFormattedHP = (
  vests: number,
  props?: DynamicGlobalProperties,
) => {
  return `${toHP(vests.toString(), props).toFixed(3)} HP`;
};

export const fromNaiAndSymbol = (obj: any) => {
  return `${(obj.amount / 1000).toFixed(obj.precision)} ${getSymbol(obj.nai)}`;
};

export const nFormatter = (num: number, digits: number) => {
  var si = [
    {
      value: 1,
      symbol: '',
    },
    {
      value: 1e3,
      symbol: 'k',
    },
    {
      value: 1e6,
      symbol: 'M',
    },
    {
      value: 1e9,
      symbol: 'G',
    },
    {
      value: 1e12,
      symbol: 'T',
    },
    {
      value: 1e15,
      symbol: 'P',
    },
    {
      value: 1e18,
      symbol: 'E',
    },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export const addRandomToKeyString = (key: string, toFixed: number) => {
  const newKey = key + Math.random().toFixed(toFixed).toString();
  return newKey;
};

export const removeHtmlTags = (str: string) => {
  return str.replace(/<(?:.|\n)*?>/gm, '');
};

export const getValFromString = (string: string): number => {
  return parseFloat(string.split(' ')[0]);
};

export const getOrdinalLabelTranslation = (active_rank: string) => {
  const result = parseFloat(active_rank) % 10;
  switch (result) {
    case 1:
      return 'common.ordinal_st_label';
    case 2:
      return 'common.ordinal_nd_label';
    case 3:
      return 'common.ordinal_rd_label';
    default:
      return 'common.ordinal_th_label';
  }
};

export const beautifyIfJSON = (message: any) => {
  try {
    return JSON.stringify(JSON.parse(message), null, 1);
  } catch (e) {
    return message;
  }
};
