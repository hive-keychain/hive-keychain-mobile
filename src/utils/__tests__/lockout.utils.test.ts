import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {LockoutUtils} from '../lockout.utils';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {translate} from '../localize';

jest.mock('@react-native-async-storage/async-storage');
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
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('checkActiveLockout', () => {
    it('should return false when no lockout is active', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await LockoutUtils.checkActiveLockout();

      expect(result).toBe(false);
      expect(Toast.show).not.toHaveBeenCalled();
    });

    it('should return false when lockout has expired', async () => {
      const pastTime = Date.now() - 10000;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(String(pastTime));

      const result = await LockoutUtils.checkActiveLockout();

      expect(result).toBe(false);
    });

    it('should return true and show toast when lockout is active', async () => {
      const futureTime = Date.now() + 60000; // 1 minute from now
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(String(futureTime));

      const result = await LockoutUtils.checkActiveLockout();

      expect(result).toBe(true);
      expect(Toast.show).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should remove lockout keys from AsyncStorage', async () => {
      await LockoutUtils.reset();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT,
        KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
      ]);
    });
  });

  describe('recordFailure', () => {
    it('should increment failure count', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0');

      await LockoutUtils.recordFailure();

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith(
        expect.arrayContaining([
          [KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT, '1'],
        ]),
      );
    });

    it('should show warning after 3 failures', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2');

      await LockoutUtils.recordFailure();

      expect(Toast.show).toHaveBeenCalledWith(
        translate('lockout.warning_after_third'),
        expect.any(Object),
      );
    });

    it('should set lockout time for 5+ failures', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');

      await LockoutUtils.recordFailure();

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith(
        expect.arrayContaining([
          [KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT, '6'],
          expect.arrayContaining([
            KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
            expect.any(String),
          ]),
        ]),
      );
      expect(Toast.show).toHaveBeenCalled();
    });

    it('should set 1 hour lockout for 9+ failures', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('9');

      await LockoutUtils.recordFailure();

      expect(AsyncStorage.multiSet).toHaveBeenCalled();
      expect(translate).toHaveBeenCalledWith('lockout.duration.hour');
    });

    it('should not set lockout for less than 5 failures', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('3');

      await LockoutUtils.recordFailure();

      const callArgs = (AsyncStorage.multiSet as jest.Mock).mock.calls[0][0];
      const hasLockUntil = callArgs.some(
        (pair: [string, string]) => pair[0] === KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
      );
      expect(hasLockUntil).toBe(false);
    });
  });
});
