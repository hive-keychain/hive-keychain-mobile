import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {translate} from 'utils/localize';

interface LockoutData {
  failCount: number;
  lockUntil: number;
}

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

const getLockoutData = async (): Promise<LockoutData> => {
  try {
    const dataStr = await SecureStore.getItemAsync(
      KeychainStorageKeyEnum.LOCKOUT_DATA,
      {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        keychainService: KeychainStorageKeyEnum.LOCKOUT_DATA,
      },
    );
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch (error) {
    // If secure store read fails, return default values
    console.warn('Failed to read lockout data from secure store:', error);
  }
  return {failCount: 0, lockUntil: 0};
};

const saveLockoutData = async (data: LockoutData): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      KeychainStorageKeyEnum.LOCKOUT_DATA,
      JSON.stringify(data),
      {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        keychainService: KeychainStorageKeyEnum.LOCKOUT_DATA,
      },
    );
  } catch (error) {
    console.error('Failed to save lockout data to secure store:', error);
    throw error;
  }
};

const deleteLockoutData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(KeychainStorageKeyEnum.LOCKOUT_DATA, {
      keychainService: KeychainStorageKeyEnum.LOCKOUT_DATA,
    });
  } catch (error) {
    console.warn('Failed to delete lockout data from secure store:', error);
  }
};

const migrateFromAsyncStorage = async (): Promise<void> => {
  // Check if migration has already been completed
  const migrationComplete = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.LOCKOUT_MIGRATION_COMPLETE,
  );
  if (migrationComplete === 'true') {
    return;
  }

  try {
    // Read existing data from AsyncStorage
    const [failCountStr, lockUntilStr] = await AsyncStorage.multiGet([
      KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT,
      KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
    ]);

    const failCount = parseInt(failCountStr[1] || '0', 10) || 0;
    const lockUntil = parseInt(lockUntilStr[1] || '0', 10) || 0;

    // Only migrate if there's actual data to migrate
    if (failCount > 0 || lockUntil > 0) {
      const lockoutData: LockoutData = {
        failCount,
        lockUntil,
      };
      await saveLockoutData(lockoutData);
    }

    // Delete old data from AsyncStorage
    await AsyncStorage.multiRemove([
      KeychainStorageKeyEnum.UNLOCK_FAIL_COUNT,
      KeychainStorageKeyEnum.UNLOCK_LOCK_UNTIL,
    ]);

    // Mark migration as complete
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.LOCKOUT_MIGRATION_COMPLETE,
      'true',
    );
  } catch (error) {
    console.error('Failed to migrate lockout data from AsyncStorage:', error);
    // Don't throw - allow the app to continue even if migration fails
  }
};
const checkActiveLockout = async (): Promise<boolean> => {
  // Ensure migration is complete before checking
  await migrateFromAsyncStorage();

  const lockoutData = await getLockoutData();
  const now = Date.now();
  if (lockoutData.lockUntil && now < lockoutData.lockUntil) {
    showActiveLockoutToast(lockoutData.lockUntil - now);
    return true;
  }
  return false;
};

const reset = async () => {
  await migrateFromAsyncStorage();
  await deleteLockoutData();
};

const recordFailure = async () => {
  await migrateFromAsyncStorage();

  const lockoutData = await getLockoutData();
  lockoutData.failCount += 1;

  showWarningIfNeeded(lockoutData.failCount);

  const lockoutMs = getLockoutMs(lockoutData.failCount);
  if (lockoutMs > 0) {
    lockoutData.lockUntil = Date.now() + lockoutMs;
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
  } else {
    lockoutData.lockUntil = 0;
  }

  await saveLockoutData(lockoutData);
};

const LockoutUtils = {
  checkActiveLockout,
  reset,
  recordFailure,
};

export default LockoutUtils;
