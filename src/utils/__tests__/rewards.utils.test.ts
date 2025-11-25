import {Asset} from '@hiveio/dhive';
import {RewardsUtils} from '../rewards.utils';
import {broadcast} from '../hiveLibs.utils';
import {getValFromString} from '../format.utils';

jest.mock('../hiveLibs.utils', () => ({
  broadcast: jest.fn(),
}));
jest.mock('../format.utils', () => ({
  getValFromString: jest.fn(),
}));

describe('RewardsUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('claimRewards', () => {
    it('should broadcast claim reward balance operation', async () => {
      (broadcast as jest.Mock).mockResolvedValue({success: true});

      const result = await RewardsUtils.claimRewards(
        'testuser',
        '1.000 HIVE',
        '0.500 HBD',
        '100.000000 VESTS',
        '5testpostingkey',
      );

      expect(broadcast).toHaveBeenCalledWith('5testpostingkey', [
        [
          'claim_reward_balance',
          {
            account: 'testuser',
            reward_hive: '1.000 HIVE',
            reward_hbd: '0.500 HBD',
            reward_vests: '100.000000 VESTS',
          },
        ],
      ]);
      expect(result).toEqual({success: true});
    });

    it('should handle Asset objects', async () => {
      (broadcast as jest.Mock).mockResolvedValue({success: true});

      const hiveAsset = Asset.fromString('1.000 HIVE');
      const hbdAsset = Asset.fromString('0.500 HBD');
      const vestsAsset = Asset.fromString('100.000000 VESTS');

      await RewardsUtils.claimRewards(
        'testuser',
        hiveAsset,
        hbdAsset,
        vestsAsset,
        '5testpostingkey',
      );

      expect(broadcast).toHaveBeenCalled();
    });
  });

  describe('hasReward', () => {
    it('should return true when HBD reward exists', () => {
      (getValFromString as jest.Mock).mockImplementation((val: string) => {
        if (val === '1.000 HBD') return 1.0;
        return 0;
      });

      const result = RewardsUtils.hasReward('1.000 HBD', '0.000 VESTS', '0.000 HIVE');

      expect(result).toBe(true);
    });

    it('should return true when HP reward exists', () => {
      (getValFromString as jest.Mock).mockImplementation((val: string) => {
        if (val === '1.000 VESTS') return 1.0;
        return 0;
      });

      const result = RewardsUtils.hasReward('0.000 HBD', '1.000 VESTS', '0.000 HIVE');

      expect(result).toBe(true);
    });

    it('should return true when HIVE reward exists', () => {
      (getValFromString as jest.Mock).mockImplementation((val: string) => {
        if (val === '1.000 HIVE') return 1.0;
        return 0;
      });

      const result = RewardsUtils.hasReward('0.000 HBD', '0.000 VESTS', '1.000 HIVE');

      expect(result).toBe(true);
    });

    it('should return false when no rewards exist', () => {
      (getValFromString as jest.Mock).mockReturnValue(0);

      const result = RewardsUtils.hasReward('0.000 HBD', '0.000 VESTS', '0.000 HIVE');

      expect(result).toBe(false);
    });

    it('should return true when multiple rewards exist', () => {
      (getValFromString as jest.Mock).mockReturnValue(1.0);

      const result = RewardsUtils.hasReward('1.000 HBD', '1.000 VESTS', '1.000 HIVE');

      expect(result).toBe(true);
    });
  });
});
