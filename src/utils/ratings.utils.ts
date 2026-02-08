import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const openStoreListing = async (): Promise<boolean> => {
  try {
    const bundleId = DeviceInfo.getBundleId();
    if (Platform.OS === 'android') {
      const marketUrl = `market://details?id=${bundleId}`;
      const webUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;
      const canOpen = await Linking.canOpenURL(marketUrl);
      await Linking.openURL(canOpen ? marketUrl : webUrl);
      return true;
    } else {
      const lookupUrl = `https://itunes.apple.com/lookup?bundleId=${bundleId}`;
      const res = await fetch(lookupUrl);
      const json = await res.json();
      const trackId = json?.results?.[0]?.trackId;
      if (trackId) {
        const reviewUrl = `itms-apps://itunes.apple.com/app/id${trackId}?action=write-review`;
        await Linking.openURL(reviewUrl);
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
};

const seedInstallTimeIfMissing = async () => {
  const existing = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.INSTALL_TIME_MS,
  );
  if (!existing) {
    const firstInstall = await DeviceInfo.getFirstInstallTime();
    const installMs =
      typeof firstInstall === 'number'
        ? firstInstall
        : new Date(firstInstall as any).getTime();
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.INSTALL_TIME_MS,
      String(installMs),
    );
  }
};

const shouldPromptNow = async (): Promise<boolean> => {
  const alreadyDone = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.RATING_PROMPT_DONE,
  );
  if (alreadyDone) return false;
  await seedInstallTimeIfMissing();
  const installTimeMsStr = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.INSTALL_TIME_MS,
  );
  const installTimeMs = installTimeMsStr ? parseInt(installTimeMsStr, 10) : 0;
  if (!installTimeMs) return false;
  const elapsed = Date.now() - installTimeMs;
  return elapsed >= THIRTY_DAYS_MS;
};

const markPrompted = async () => {
  await AsyncStorage.setItem(KeychainStorageKeyEnum.RATING_PROMPT_DONE, 'true');
};

const openReview = async (): Promise<boolean> => {
  let asked = false;
  try {
    if (StoreReview && (await StoreReview.isAvailableAsync())) {
      asked = true;
      await StoreReview.requestReview();
    }
  } catch {
    // ignore and try fallback
  }
  if (!asked) {
    asked = await openStoreListing();
  }
  if (asked) {
    await markPrompted();
  }
  return asked;
};

const maybeAskForRating = async () => {
  try {
    if (!(await shouldPromptNow())) return;
    await openReview();
  } catch {
    // As a safety, mark done to avoid nagging on errors
    await markPrompted();
  }
};

export const RatingsUtils = {
  seedInstallTimeIfMissing,
  shouldPromptNow,
  markPrompted,
  openReview,
  maybeAskForRating,
};
