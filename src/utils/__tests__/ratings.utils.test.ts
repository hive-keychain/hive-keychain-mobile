import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import {Linking} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {RatingsUtils} from '../ratings.utils';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));
jest.mock('react-native', () => ({
  Linking: {
    canOpenURL: jest.fn(),
    openURL: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));
jest.mock('react-native-device-info', () => ({
  getBundleId: jest.fn(() => 'com.test.app'),
  getFirstInstallTime: jest.fn(() => Promise.resolve(Date.now() - 35 * 24 * 60 * 60 * 1000)),
}));

global.fetch = jest.fn();

describe('RatingsUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('seedInstallTimeIfMissing', () => {
    it('should seed install time if missing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (DeviceInfo.getFirstInstallTime as jest.Mock).mockResolvedValue(Date.now());

      await RatingsUtils.seedInstallTimeIfMissing();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.INSTALL_TIME_MS,
      );
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should not seed if install time exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('1234567890');

      await RatingsUtils.seedInstallTimeIfMissing();

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('shouldPromptNow', () => {
    it('should return false if already prompted', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('true')
        .mockResolvedValueOnce(null);

      const result = await RatingsUtils.shouldPromptNow();

      expect(result).toBe(false);
    });

    it('should return true if 30+ days have passed', async () => {
      const oldInstallTime = Date.now() - 35 * 24 * 60 * 60 * 1000;
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(String(oldInstallTime));

      const result = await RatingsUtils.shouldPromptNow();

      expect(result).toBe(true);
    });
  });

  describe('markPrompted', () => {
    it('should mark rating prompt as done', async () => {
      await RatingsUtils.markPrompted();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.RATING_PROMPT_DONE,
        'true',
      );
    });
  });

  describe('openReview', () => {
    it('should use StoreReview if available', async () => {
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      const result = await RatingsUtils.openReview();

      expect(StoreReview.isAvailableAsync).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('maybeAskForRating', () => {
    it('should ask for rating if conditions are met', async () => {
      const oldInstallTime = Date.now() - 35 * 24 * 60 * 60 * 1000;
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(String(oldInstallTime));
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await RatingsUtils.maybeAskForRating();

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });
  });
});
