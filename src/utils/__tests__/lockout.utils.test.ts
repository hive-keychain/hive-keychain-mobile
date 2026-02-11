import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';
import LockoutUtils from '../lockout.utils';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {translate} from '../localize';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-secure-store');
jest.mock('react-native-root-toast', () => ({
  show: jest.fn(),
  durations: {
    LONG: 5000,
  },
}));
jest.mock('../localize', () => ({
  translate: jest.fn((key: string, options?: any) => key),
}));

describe('LockoutUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Mock migration as already complete by default
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('checkActiveLockout', () => {
    it('should return false when no lockout is active', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await LockoutUtils.checkActiveLockout();

      expect(result).toBe(false);
      expect(Toast.show).not.toHaveBeenCalled();
    });

    it('should return false when lockout has expired', async () => {
      const pastTime = Date.now() - 10000;
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 0, lockUntil: pastTime}),
      );

      const result = await LockoutUtils.checkActiveLockout();

      expect(result).toBe(false);
    });

    it('should return true and show toast when lockout is active', async () => {
      const futureTime = Date.now() + 60000; // 1 minute from now
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 5, lockUntil: futureTime}),
      );

      const result = await LockoutUtils.checkActiveLockout();

      expect(result).toBe(true);
      expect(Toast.show).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should remove lockout data from SecureStore', async () => {
      await LockoutUtils.reset();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.LOCKOUT_DATA,
        expect.objectContaining({
          keychainService: KeychainStorageKeyEnum.LOCKOUT_DATA,
        }),
      );
    });
  });

  describe('recordFailure', () => {
    it('should increment failure count', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 0, lockUntil: 0}),
      );
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await LockoutUtils.recordFailure();

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.LOCKOUT_DATA,
        JSON.stringify({failCount: 1, lockUntil: 0}),
        expect.any(Object),
      );
    });

    it('should show warning after 3 failures', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 2, lockUntil: 0}),
      );
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await LockoutUtils.recordFailure();

      expect(Toast.show).toHaveBeenCalledWith(
        translate('lockout.warning_after_third'),
        expect.any(Object),
      );
    });

    it('should set lockout time for 5+ failures', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 5, lockUntil: 0}),
      );
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await LockoutUtils.recordFailure();

      expect(SecureStore.setItemAsync).toHaveBeenCalled();
      const callArgs = (SecureStore.setItemAsync as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.failCount).toBe(6);
      expect(savedData.lockUntil).toBeGreaterThan(Date.now());
      expect(Toast.show).toHaveBeenCalled();
    });

    it('should set 1 hour lockout for 9+ failures', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 9, lockUntil: 0}),
      );
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await LockoutUtils.recordFailure();

      expect(SecureStore.setItemAsync).toHaveBeenCalled();
      expect(translate).toHaveBeenCalledWith('lockout.duration.hour');
    });

    it('should not set lockout for less than 5 failures', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({failCount: 3, lockUntil: 0}),
      );
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await LockoutUtils.recordFailure();

      const callArgs = (SecureStore.setItemAsync as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.failCount).toBe(4);
      expect(savedData.lockUntil).toBe(0);
    });
  });
});
