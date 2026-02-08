import {SavingsUtils} from '../savings.utils';
import {Asset} from '@hiveio/dhive';
import {ActiveAccount} from 'actions/interfaces';
import {depositToSavings, withdrawFromSavings, getClient} from '../hiveLibs.utils';

jest.mock('../hiveLibs.utils');

describe('SavingsUtils', () => {
  describe('hasBalance', () => {
    it('should return true when balance string is greater than threshold', () => {
      const result = SavingsUtils.hasBalance('1.000 HBD', 0.5);
      expect(result).toBe(true);
    });

    it('should return false when balance string is less than threshold', () => {
      const result = SavingsUtils.hasBalance('0.0001 HBD', 0.5);
      expect(result).toBe(false);
    });

    it('should return true when Asset amount is greater than threshold', () => {
      const asset = Asset.fromString('1.000 HBD');
      const result = SavingsUtils.hasBalance(asset, 0.5);
      expect(result).toBe(true);
    });

    it('should return true when balance equals threshold', () => {
      const result = SavingsUtils.hasBalance('0.001 HBD', 0.001);
      expect(result).toBe(true);
    });
  });

  describe('claimSavings', () => {
    it('should deposit when has HBD balance', async () => {
      const activeAccount: ActiveAccount = {
        name: 'testuser',
        account: {
          hbd_balance: '1.000 HBD',
          savings_hbd_balance: '0.000 HBD',
        } as any,
        keys: {
          active: 'STM...',
        },
      } as ActiveAccount;
      (depositToSavings as jest.Mock).mockResolvedValueOnce(true);
      const result = await SavingsUtils.claimSavings(activeAccount);
      expect(depositToSavings).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should withdraw when has savings balance', async () => {
      const activeAccount: ActiveAccount = {
        name: 'testuser',
        account: {
          hbd_balance: '0.000 HBD',
          savings_hbd_balance: '1.000 HBD',
        } as any,
        keys: {
          active: 'STM...',
        },
      } as ActiveAccount;
      (withdrawFromSavings as jest.Mock).mockResolvedValueOnce(true);
      const result = await SavingsUtils.claimSavings(activeAccount);
      expect(withdrawFromSavings).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when no balance', async () => {
      const activeAccount: ActiveAccount = {
        name: 'testuser',
        account: {
          hbd_balance: '0.000 HBD',
          savings_hbd_balance: '0.000 HBD',
        } as any,
        keys: {
          active: 'STM...',
        },
      } as ActiveAccount;
      const result = await SavingsUtils.claimSavings(activeAccount);
      expect(result).toBe(false);
    });
  });
});
