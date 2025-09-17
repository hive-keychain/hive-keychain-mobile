import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {translate} from 'utils/localize';

const formatRemaining = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const unitHour = translate('lockout.time.h');
  const unitMinute = translate('lockout.time.m');
  const unitSecond = translate('lockout.time.s');
  const separator = translate('lockout.time.separator') || ' ';

  const parts: string[] = [];
  if (hours) parts.push(`${hours}${unitHour}`);
  if (minutes) parts.push(`${minutes}${unitMinute}`);
  if (!hours && seconds) parts.push(`${seconds}${unitSecond}`);
  return parts.join(separator);
};

const getLockoutMs = (count: number) => {
  if (count >= 9) return 60 * 60 * 1000; // 1 hour
  if (count === 8) return 15 * 60 * 1000; // 15 minutes
  if (count === 7) return 5 * 60 * 1000; // 5 minutes
  if (count === 6) return 60 * 1000; // 1 minute
  if (count === 5) return 30 * 1000; // 30 seconds
  return 0; // 0–4: no delay
};

const showWarningIfNeeded = (failCount: number) => {
  if (failCount === 3) {
    Toast.show(translate('lockout.warning_after_third'), {
      duration: Toast.durations.LONG,
    });
  }
};

const showActiveLockoutToast = (remainingMs: number) => {
  const readable = formatRemaining(remainingMs);
  Toast.show(translate('lockout.active', {time: readable}), {
    duration: Toast.durations.LONG,
  });
};

export const LockoutUtils = {
  checkActiveLockout: async (): Promise<boolean> => {
    const lockUntilStr = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
    );
    const now = Date.now();
    const lockUntil = parseInt(lockUntilStr || '0', 10) || 0;
    if (lockUntil && now < lockUntil) {
      showActiveLockoutToast(lockUntil - now);
      return true;
    }
    return false;
  },

  reset: async () => {
    await AsyncStorage.multiRemove([
      KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT,
      KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
    ]);
  },

  recordFailure: async () => {
    const failCountStr =
      (await AsyncStorage.getItem(KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT)) ||
      '0';
    let failCount = parseInt(failCountStr || '0', 10) || 0;
    failCount += 1;

    showWarningIfNeeded(failCount);

    const lockoutMs = getLockoutMs(failCount);
    const multiSetPairs: [string, string][] = [
      [KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT, failCount.toString()],
    ];
    if (lockoutMs > 0) {
      const until = Date.now() + lockoutMs;
      multiSetPairs.push([
        KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
        until.toString(),
      ]);
      const human =
        lockoutMs >= 60 * 60 * 1000
          ? translate('lockout.duration.hour')
          : lockoutMs >= 15 * 60 * 1000
          ? translate('lockout.duration.fifteen_minutes')
          : lockoutMs >= 5 * 60 * 1000
          ? translate('lockout.duration.five_minutes')
          : lockoutMs >= 60 * 1000
          ? translate('lockout.duration.minute')
          : translate('lockout.duration.thirty_seconds');
      Toast.show(translate('lockout.locked_for', {time: human}), {
        duration: Toast.durations.LONG,
      });
    }
    await AsyncStorage.multiSet(multiSetPairs);
  },
};

export default LockoutUtils;
