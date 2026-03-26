import {
  withCommas,
  toHP,
  getUSDFromVests,
  fromHP,
  chunkArray,
  signedNumber,
  formatBalance,
  formatBalanceCurrency,
  getCleanAmountValue,
  capitalize,
  wordsFromCamelCase,
  beautifyTransferError,
  getSymbol,
  getAmountFromNai,
  toFormattedHP,
  fromNaiAndSymbol,
  nFormatter,
  addRandomToKeyString,
  removeHtmlTags,
  getValFromString,
  getOrdinalLabelTranslation,
  beautifyIfJSON,
} from '../format.utils';
import {Asset, DynamicGlobalProperties} from '@hiveio/dhive';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import {HiveErrorMessage} from 'src/interfaces/keychain.interface';

describe('format.utils', () => {
  describe('withCommas', () => {
    it('should format number with commas', () => {
      expect(withCommas('1000')).toBe('1,000');
      expect(withCommas('1000000')).toBe('1,000,000');
    });

    it('should respect decimal places', () => {
      expect(withCommas('1234.5678', 2)).toBe('1,234.57');
      expect(withCommas('1234.5678', 0)).toBe('1,235');
    });

    it('should handle small numbers', () => {
      expect(withCommas('123')).toBe('123');
      expect(withCommas('12.34')).toBe('12.34');
    });
  });

  describe('toHP', () => {
    it('should convert vests to HP', () => {
      const props: DynamicGlobalProperties = {
        total_vesting_fund_hive: '1000000',
        total_vesting_shares: '2000000',
      } as DynamicGlobalProperties;
      expect(toHP('2000000', props)).toBe(1000000);
    });

    it('should return 0 when props are not provided', () => {
      expect(toHP('1000')).toBe(0);
    });

    it('should handle string conversion of props', () => {
      const props: DynamicGlobalProperties = {
        total_vesting_fund_hive: '1000000.000 HIVE',
        total_vesting_shares: '2000000.000000 VESTS',
      } as DynamicGlobalProperties;
      const result = toHP('2000000', props);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('getUSDFromVests', () => {
    it('should convert vests to USD', () => {
      const globalProperties: GlobalProperties = {
        globals: {
          total_vesting_fund_hive: '1000000',
          total_vesting_shares: '2000000',
        } as DynamicGlobalProperties,
      };
      const currencyPrices: CurrencyPrices = {
        hive: {usd: 0.5},
      } as CurrencyPrices;

      const result = getUSDFromVests(2000000, globalProperties, currencyPrices);
      expect(result).toBe('500000.00');
    });

    it('should handle zero vests', () => {
      const globalProperties: GlobalProperties = {
        globals: {
          total_vesting_fund_hive: '1000000',
          total_vesting_shares: '2000000',
        } as DynamicGlobalProperties,
      };
      const currencyPrices: CurrencyPrices = {
        hive: {usd: 0.5},
      } as CurrencyPrices;

      const result = getUSDFromVests(0, globalProperties, currencyPrices);
      expect(result).toBe('0.00');
    });
  });

  describe('toFormattedHP', () => {
    it('should format HP with 3 decimals', () => {
      const props: DynamicGlobalProperties = {
        total_vesting_fund_hive: '1000000',
        total_vesting_shares: '2000000',
      } as DynamicGlobalProperties;
      const result = toFormattedHP(2000000, props);
      expect(result).toBe('1000000.000 HP');
    });

    it('should return 0.000 HP when props are not provided', () => {
      const result = toFormattedHP(1000);
      expect(result).toBe('0.000 HP');
    });
  });

  describe('fromHP', () => {
    it('should convert HP to vests', () => {
      const props: DynamicGlobalProperties = {
        total_vesting_fund_hive: '1000000',
        total_vesting_shares: '2000000',
      } as DynamicGlobalProperties;
      expect(fromHP('1000000', props)).toBe(2000000);
    });
  });

  describe('chunkArray', () => {
    it('should chunk array into smaller arrays', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const result = chunkArray(array, 3);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty array', () => {
      expect(chunkArray([], 3)).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('signedNumber', () => {
    it('should format positive number with plus sign', () => {
      expect(signedNumber(5)).toBe('+ 5');
    });

    it('should format negative number with minus sign', () => {
      expect(signedNumber(-5)).toBe('- 5');
    });

    it('should handle zero', () => {
      // Zero is not > 0, so it goes to else branch and returns "0"
      expect(signedNumber(0)).toBe('0');
    });
  });

  describe('formatBalance', () => {
    it('should format large numbers without decimals', () => {
      expect(formatBalance(1500)).toBe('1,500');
      expect(formatBalance(-2000)).toBe('-2,000');
    });

    it('should format small numbers with decimals', () => {
      expect(formatBalance(123.456)).toBe('123.456');
      expect(formatBalance(-50.789)).toBe('-50.789');
    });
  });

  describe('formatBalanceCurrency', () => {
    it('should format balance with currency', () => {
      expect(formatBalanceCurrency('1500 HIVE')).toBe('1,500 HIVE');
      expect(formatBalanceCurrency('123.456 HBD')).toBe('123.456 HBD');
    });

    it('should handle balances with commas', () => {
      expect(formatBalanceCurrency('1,500 HIVE')).toBe('1,500 HIVE');
    });
  });

  describe('getCleanAmountValue', () => {
    it('should remove commas and currency', () => {
      expect(getCleanAmountValue('1,500 HIVE')).toBe('1500');
      expect(getCleanAmountValue('123.456 HBD')).toBe('123.456');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('wordsFromCamelCase', () => {
    it('should split camelCase into words', () => {
      expect(wordsFromCamelCase('camelCase')).toBe('camel Case');
      expect(wordsFromCamelCase('getMaxValue')).toBe('get Max Value');
    });
  });

  describe('getSymbol', () => {
    it('should return correct symbol for NAI', () => {
      expect(getSymbol('@@000000013')).toBe('HBD');
      expect(getSymbol('@@000000021')).toBe('HIVE');
      expect(getSymbol('@@000000037')).toBe('HP');
    });

    it('should return undefined for unknown NAI', () => {
      expect(getSymbol('@@000000000')).toBeUndefined();
    });
  });

  describe('fromNaiAndSymbol', () => {
    it('should format amount from NAI object', () => {
      const obj = {amount: 1000000, precision: 3, nai: '@@000000021'};
      expect(fromNaiAndSymbol(obj)).toBe('1000.000 HIVE');
    });

    it('should handle HBD NAI', () => {
      const obj = {amount: 500000, precision: 3, nai: '@@000000013'};
      expect(fromNaiAndSymbol(obj)).toBe('500.000 HBD');
    });

    it('should handle HP NAI', () => {
      const obj = {amount: 2000000, precision: 3, nai: '@@000000037'};
      expect(fromNaiAndSymbol(obj)).toBe('2000.000 HP');
    });

    it('should handle different precision values', () => {
      const obj = {amount: 1234567, precision: 2, nai: '@@000000021'};
      expect(fromNaiAndSymbol(obj)).toBe('1234.57 HIVE');
    });
  });

  describe('getAmountFromNai', () => {
    it('should extract amount from NAI object', () => {
      const obj = {amount: 1000000, precision: 3, nai: '@@000000021'};
      const result = getAmountFromNai(obj);
      // Asset.fromString returns a number (the amount)
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('should handle HBD NAI', () => {
      const obj = {amount: 500000, precision: 3, nai: '@@000000013'};
      const result = getAmountFromNai(obj);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('nFormatter', () => {
    it('should format numbers with suffixes', () => {
      expect(nFormatter(1000, 1)).toBe('1k');
      expect(nFormatter(1000000, 1)).toBe('1M');
      expect(nFormatter(1000000000, 1)).toBe('1G');
    });

    it('should handle decimals', () => {
      expect(nFormatter(1500, 1)).toBe('1.5k');
      expect(nFormatter(1234567, 2)).toBe('1.23M');
    });

    it('should handle small numbers', () => {
      expect(nFormatter(500, 1)).toBe('500');
      expect(nFormatter(99, 1)).toBe('99');
    });
  });

  describe('addRandomToKeyString', () => {
    it('should add random number to key', () => {
      const key = 'test';
      const result = addRandomToKeyString(key, 5);
      expect(result).toMatch(/^test0\.\d{5}$/);
    });
  });

  describe('removeHtmlTags', () => {
    it('should remove HTML tags', () => {
      expect(removeHtmlTags('<p>Hello</p>')).toBe('Hello');
      expect(removeHtmlTags('<div><span>Test</span></div>')).toBe('Test');
    });

    it('should handle text without tags', () => {
      expect(removeHtmlTags('Plain text')).toBe('Plain text');
    });
  });

  describe('getValFromString', () => {
    it('should extract numeric value from string', () => {
      expect(getValFromString('123.45 HIVE')).toBe(123.45);
      expect(getValFromString('1000')).toBe(1000);
    });
  });

  describe('getOrdinalLabelTranslation', () => {
    it('should return correct ordinal for 1', () => {
      expect(getOrdinalLabelTranslation('1')).toBe('common.ordinal_st_label');
      expect(getOrdinalLabelTranslation('11')).toBe('common.ordinal_st_label');
      expect(getOrdinalLabelTranslation('21')).toBe('common.ordinal_st_label');
    });

    it('should return correct ordinal for 2', () => {
      expect(getOrdinalLabelTranslation('2')).toBe('common.ordinal_nd_label');
      expect(getOrdinalLabelTranslation('22')).toBe('common.ordinal_nd_label');
    });

    it('should return correct ordinal for 3', () => {
      expect(getOrdinalLabelTranslation('3')).toBe('common.ordinal_rd_label');
      expect(getOrdinalLabelTranslation('23')).toBe('common.ordinal_rd_label');
    });

    it('should return correct ordinal for other numbers', () => {
      expect(getOrdinalLabelTranslation('4')).toBe('common.ordinal_th_label');
      expect(getOrdinalLabelTranslation('10')).toBe('common.ordinal_th_label');
      expect(getOrdinalLabelTranslation('15')).toBe('common.ordinal_th_label');
    });
  });

  describe('beautifyIfJSON', () => {
    it('should format valid JSON', () => {
      const json = '{"key":"value"}';
      const result = beautifyIfJSON(json);
      expect(result).toContain('key');
      expect(result).toContain('value');
      expect(result).toContain('\n');
    });

    it('should format double-encoded JSON strings', () => {
      const json = '"{\\"key\\":\\"value\\"}"';
      const result = beautifyIfJSON(json);
      expect(result).toContain('key');
      expect(result).toContain('value');
      expect(result).toContain('\n');
    });

    it('should return original string if not JSON', () => {
      const text = 'Not a JSON string';
      expect(beautifyIfJSON(text)).toBe(text);
    });
  });

  describe('beautifyTransferError', () => {
    it('should return encrypt error for Unable to serialize', () => {
      const err: HiveErrorMessage = {
        message: 'Unable to serialize',
      } as HiveErrorMessage;
      const result = beautifyTransferError(err, {});
      expect(result).toBe('request.error.transfer.encrypt');
    });

    it('should return adjust_balance error', () => {
      const err: HiveErrorMessage = {
        data: {
          stack: [
            {
              context: {
                method: 'adjust_balance',
              },
            },
          ],
        },
      } as HiveErrorMessage;
      const result = beautifyTransferError(err, {
        currency: 'HIVE',
        username: 'user1',
      });
      expect(result).toContain('request.error.transfer.adjust_balance');
    });

    it('should return get_account error', () => {
      const err: HiveErrorMessage = {
        data: {
          stack: [
            {
              context: {
                method: 'get_account',
              },
            },
          ],
        },
      } as HiveErrorMessage;
      const result = beautifyTransferError(err, {to: 'recipient'});
      expect(result).toContain('request.error.transfer.get_account');
    });

    it('should return default broadcasting error', () => {
      const err: HiveErrorMessage = {
        data: {
          stack: [
            {
              context: {
                method: 'unknown_method',
              },
            },
          ],
        },
      } as HiveErrorMessage;
      const result = beautifyTransferError(err, {});
      expect(result).toBe('request.error.broadcasting');
    });

    it('should return default error when stack is empty', () => {
      const err: HiveErrorMessage = {
        data: {
          stack: [],
        },
      } as HiveErrorMessage;
      const result = beautifyTransferError(err, {});
      expect(result).toBe('request.error.broadcasting');
    });

    it('should return default error when data is missing', () => {
      const err: HiveErrorMessage = {
        message: 'Some error',
      } as HiveErrorMessage;
      const result = beautifyTransferError(err, {});
      expect(result).toBe('request.error.broadcasting');
    });
  });
});

