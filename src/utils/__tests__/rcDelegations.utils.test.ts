import {RcDelegationsUtils} from '../rcDelegations.utils';
import {GlobalProperties} from 'actions/interfaces';

jest.mock('../hiveLibs.utils', () => ({
  getData: jest.fn(),
  broadcastJson: jest.fn(),
}));

describe('RcDelegationsUtils', () => {
  const mockProperties: GlobalProperties = {
    globals: {
      total_vesting_fund_hive: '1000000.000 HIVE',
      total_vesting_shares: '2000000.000000 VESTS',
    } as any,
  };

  describe('getHivePerVests', () => {
    it('should calculate HIVE per VESTS', () => {
      const result = RcDelegationsUtils.getHivePerVests(mockProperties);
      expect(result).toBe(0.5); // 1000000 / 2000000
    });
  });

  describe('rcToGigaRc', () => {
    it('should convert RC to Giga RC', () => {
      const result = RcDelegationsUtils.rcToGigaRc(1000000000);
      expect(result).toBe('1.000');
    });

    it('should handle zero', () => {
      const result = RcDelegationsUtils.rcToGigaRc(0);
      expect(result).toBe('0.000');
    });
  });

  describe('gigaRcToRc', () => {
    it('should convert Giga RC to RC', () => {
      const result = RcDelegationsUtils.gigaRcToRc(1);
      expect(result).toBe(1000000000);
    });

    it('should handle zero', () => {
      const result = RcDelegationsUtils.gigaRcToRc(0);
      expect(result).toBe(0);
    });
  });

  describe('gigaRcToHp', () => {
    it('should convert Giga RC to HP', () => {
      const result = RcDelegationsUtils.gigaRcToHp('1', mockProperties);
      expect(result).toBe('500.000'); // (1 * 1000000000 * 0.5) / 1000000
    });
  });

  describe('hpToGigaRc', () => {
    it('should convert HP to Giga RC', () => {
      const result = RcDelegationsUtils.hpToGigaRc('500', mockProperties);
      expect(result).toBe('1.000'); // (500 / 0.5) * 1000000 / 1000000000
    });
  });

  describe('rcToHp', () => {
    it('should convert RC to HP', () => {
      const result = RcDelegationsUtils.rcToHp('1000000000', mockProperties);
      expect(result).toBe('500.000');
    });
  });

  describe('formatRcWithUnit', () => {
    it('should format RC in Giga RC', () => {
      const result = RcDelegationsUtils.formatRcWithUnit('1000000000');
      expect(result).toBe('1.000 G RC');
    });

    it('should format RC in Tera RC', () => {
      const result = RcDelegationsUtils.formatRcWithUnit('1000000000000');
      expect(result).toBe('1.000 T RC');
    });

    it('should format RC in Peta RC', () => {
      const result = RcDelegationsUtils.formatRcWithUnit('1000000000000000');
      expect(result).toBe('1.000 P RC');
    });

    it('should handle fromGiga parameter', () => {
      const result = RcDelegationsUtils.formatRcWithUnit('1', true);
      expect(result).toBe('1.000 G RC');
    });
  });
});
