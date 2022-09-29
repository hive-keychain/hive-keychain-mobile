import {HiveErrorMessage} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testDynamicGlobalProperties from '__tests__/utils-for-testing/data/test-dynamic-global-properties';

const withCommas = [
  {nb: '12.0014544', decimals: 3, expected: '12.001'},
  {nb: '0.0001', decimals: 2, expected: '0'},
  {nb: '0.00333', decimals: 3, expected: '0.003'},
  {nb: '1,00333', decimals: 3, expected: '1'},
];

const toHP = [
  {vests: '10000000', expected: 0},
  {
    vests: '10000000',
    globalProps: testDynamicGlobalProperties,
    expected: 5458.633941648806,
  },
  {
    vests: '10000',
    globalProps: testDynamicGlobalProperties,
    expected: 5.458633941648806,
  },
];

const fromHP = [
  {hp: '1000', expected: 1831960.1766480522},
  {hp: '9999', expected: 18317769.806303874},
  {hp: '0', expected: 0},
  {hp: '34000000', expected: 62286646006.033775},
];

const chunkArray = [
  {
    myArray: ['1', '2', 3, 50, true],
    chunk_size: 2,
    expected: [['1', '2'], [3, 50], [true]],
  },
  {
    myArray: ['1', '{}', {key: 10}, 50, true],
    chunk_size: 1,
    expected: [['1'], ['{}'], [{key: 10}], [50], [true]],
  },
];

const signedNumber = [
  {nb: -10, expected: '- 10'},
  {nb: -1000.45, expected: '- 1000.45'},
  {nb: -0.45, expected: '- 0.45'},
  {nb: 0, expected: '0'},
];

const formatBalance = [
  {balance: 90, expected: '90'},
  {balance: 1000, expected: '1,000'},
  {balance: 0, expected: '0'},
  {balance: 1990090, expected: '1,990,090'},
];

const capitalize = [
  {string: 'hive blog', expect: 'Hive blog'},
  {string: 'ALREADY', expect: 'ALREADY'},
  {string: 'notQuite', expect: 'NotQuite'},
  {string: ' tricky?', expect: 'Tricky?'},
];

const beautifyTransferError = [
  {
    err: {
      data: {
        stack: [
          {
            context: {
              method: 'adjust_balance',
            },
          },
        ],
      },
      message: 'error message',
    } as HiveErrorMessage,
    params: {
      currency: 'HIVE',
      username: testAccount._default.name,
      to: 'theghost1980',
    },
    expect: (currency: string, username: string, to: string) =>
      translate('request.error.transfer.adjust_balance', {
        currency,
        username,
      }),
  },
  {
    err: {
      data: {
        stack: [
          {
            context: {
              method: 'get_account',
            },
          },
        ],
      },
      message: 'error message',
    } as HiveErrorMessage,
    params: {
      currency: 'HIVE',
      username: testAccount._default.name,
      to: 'theghost1980',
    },
    expect: (currency: string, username: string, to: string) =>
      translate('request.error.transfer.get_account', {to}),
  },
  {
    err: {
      data: {
        stack: [
          {
            context: {
              method: 'default case',
            },
          },
        ],
      },
      message: 'error message',
    } as HiveErrorMessage,
    params: {
      currency: 'HIVE',
      username: testAccount._default.name,
      to: 'theghost1980',
    },
    expect: (currency: string, username: string, to: string) =>
      translate('request.error.broadcasting'),
  },
  {
    err: {
      message: 'Unable to serialize',
    } as HiveErrorMessage,
    params: {
      currency: 'HIVE',
      username: testAccount._default.name,
      to: 'theghost1980',
    },
    expect: (currency: string, username: string, to: string) =>
      translate('request.error.transfer.encrypt'),
  },
];

const getSymbol = [
  {nai: '@@000000013', expect: 'HBD'},
  {nai: '@@000000021', expect: 'HIVE'},
  {nai: '@@000000037', expect: 'HP'},
];

const nFormatter = [
  {num: 1, digits: 1, expect: '1'},
  {num: 10, digits: 2, expect: '10'},
  {num: 100, digits: 2, expect: '100'},
  {num: 1000, digits: 2, expect: '1k'},
  {num: 10000, digits: 2, expect: '10k'},
  {num: 100000, digits: 3, expect: '100k'},
  {num: 1000000, digits: 3, expect: '1M'},
  {num: 10000000, digits: 3, expect: '10M'},
  {num: 100000000, digits: 3, expect: '100M'},
  {num: 1000000000, digits: 3, expect: '1G'},
  {num: 10000000000, digits: 3, expect: '10G'},
  {num: 100000000000, digits: 3, expect: '100G'},
  {num: 1000000000000, digits: 3, expect: '1T'},
  {num: 10000000000000, digits: 3, expect: '10T'},
  {num: 100000000000000, digits: 3, expect: '100T'},
  {num: 1000000000000000, digits: 3, expect: '1P'},
  {num: 1000000000000000000, digits: 3, expect: '1E'},
];

const cases = {
  withCommas,
  toHP,
  fromHP,
  chunkArray,
  signedNumber,
  formatBalance,
  capitalize,
  beautifyTransferError,
  getSymbol,
  nFormatter,
};

export default {cases};
