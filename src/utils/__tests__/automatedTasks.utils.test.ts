import AutomatedTasksUtils from '../automatedTasks.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {ActiveAccount} from 'actions/interfaces';

describe('AutomatedTasksUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClaims', () => {
    it('should return claims for user', async () => {
      const mockClaims = {
        [KeychainStorageKeyEnum.CLAIM_REWARDS]: JSON.stringify({user1: true}),
        [KeychainStorageKeyEnum.CLAIM_ACCOUNTS]: JSON.stringify({user1: false}),
        [KeychainStorageKeyEnum.CLAIM_SAVINGS]: JSON.stringify({user1: true}),
      };
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValueOnce([
        [KeychainStorageKeyEnum.CLAIM_REWARDS, mockClaims[KeychainStorageKeyEnum.CLAIM_REWARDS]],
        [KeychainStorageKeyEnum.CLAIM_ACCOUNTS, mockClaims[KeychainStorageKeyEnum.CLAIM_ACCOUNTS]],
        [KeychainStorageKeyEnum.CLAIM_SAVINGS, mockClaims[KeychainStorageKeyEnum.CLAIM_SAVINGS]],
      ]);
      const result = await AutomatedTasksUtils.getClaims('user1');
      expect(result[KeychainStorageKeyEnum.CLAIM_REWARDS]).toBe(true);
      expect(result[KeychainStorageKeyEnum.CLAIM_ACCOUNTS]).toBe(false);
      expect(result[KeychainStorageKeyEnum.CLAIM_SAVINGS]).toBe(true);
    });
  });

  describe('saveClaims', () => {
    it('should save claims for user', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValueOnce([
        [KeychainStorageKeyEnum.CLAIM_REWARDS, null],
        [KeychainStorageKeyEnum.CLAIM_ACCOUNTS, null],
        [KeychainStorageKeyEnum.CLAIM_SAVINGS, null],
      ]);
      await AutomatedTasksUtils.saveClaims(true, false, true, 'user1');
      expect(AsyncStorage.multiSet).toHaveBeenCalled();
    });
  });

  describe('canClaimSavingsErrorMessage', () => {
    it('should return error if no active key', () => {
      const account: ActiveAccount = {
        keys: {},
      } as ActiveAccount;
      const result = AutomatedTasksUtils.canClaimSavingsErrorMessage(account);
      expect(result).toBeDefined();
    });

    it('should return undefined if active key exists', () => {
      const account: ActiveAccount = {
        keys: {active: 'STM...'},
      } as ActiveAccount;
      const result = AutomatedTasksUtils.canClaimSavingsErrorMessage(account);
      expect(result).toBeUndefined();
    });
  });

  describe('canClaimRewardsErrorMessage', () => {
    it('should return error if no posting key', () => {
      const account: ActiveAccount = {
        keys: {},
      } as ActiveAccount;
      const result = AutomatedTasksUtils.canClaimRewardsErrorMessage(account);
      expect(result).toBeDefined();
    });

    it('should return undefined if posting key exists', () => {
      const account: ActiveAccount = {
        keys: {posting: 'STM...'},
      } as ActiveAccount;
      const result = AutomatedTasksUtils.canClaimRewardsErrorMessage(account);
      expect(result).toBeUndefined();
    });
  });

  describe('getUserAutoStake', () => {
    it('should return auto stake status', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({user1: true}),
      );
      const result = await AutomatedTasksUtils.getUserAutoStake('user1');
      expect(result).toBe(true);
    });

    it('should return false if not set', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await AutomatedTasksUtils.getUserAutoStake('user1');
      expect(result).toBe(false);
    });
  });

  describe('saveUserAutoStake', () => {
    it('should save auto stake status', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      await AutomatedTasksUtils.saveUserAutoStake('user1', true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
