import CurrencyUtils, {BaseCurrencies} from '../currency.utils';

describe('CurrencyUtils', () => {
  describe('getCurrencyLabels', () => {
    it('should return mainnet labels when isTestnet is false', () => {
      const labels = CurrencyUtils.getCurrencyLabels(false);
      expect(labels).toEqual({
        hive: 'HIVE',
        hbd: 'HBD',
        hp: 'HP',
      });
    });

    it('should return testnet labels when isTestnet is true', () => {
      const labels = CurrencyUtils.getCurrencyLabels(true);
      expect(labels).toEqual({
        hive: 'TESTS',
        hbd: 'TBD',
        hp: 'TP',
      });
    });
  });

  describe('getCurrencyLabel', () => {
    it('should return HIVE for mainnet', () => {
      expect(CurrencyUtils.getCurrencyLabel(BaseCurrencies.HIVE, false)).toBe(
        'HIVE',
      );
    });

    it('should return HBD for mainnet', () => {
      expect(CurrencyUtils.getCurrencyLabel(BaseCurrencies.HBD, false)).toBe(
        'HBD',
      );
    });

    it('should return TESTS for testnet hive', () => {
      expect(CurrencyUtils.getCurrencyLabel(BaseCurrencies.HIVE, true)).toBe(
        'TESTS',
      );
    });

    it('should return TBD for testnet hbd', () => {
      expect(CurrencyUtils.getCurrencyLabel(BaseCurrencies.HBD, true)).toBe(
        'TBD',
      );
    });

    it('should return uppercase for unknown currency', () => {
      expect(CurrencyUtils.getCurrencyLabel('unknown', false)).toBe(
        'UNKNOWN',
      );
    });

    it('should handle case insensitive input', () => {
      expect(CurrencyUtils.getCurrencyLabel('HIVE', false)).toBe('HIVE');
      expect(CurrencyUtils.getCurrencyLabel('hive', false)).toBe('HIVE');
      expect(CurrencyUtils.getCurrencyLabel('HiVe', false)).toBe('HIVE');
    });
  });
});















