import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as LocalAuthentication from 'expo-local-authentication';
import {Platform} from 'react-native';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {ModalComponent} from 'src/enums/modal.enum';
import AuthUtils from 'utils/authentication.utils';
import {decryptToJson} from 'utils/encrypt.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';
import {EncryptedStorageUtils} from './encryptedStorage.utils';
import {clearKeychain, getFromKeychain} from './keychainStorage.utils';
import SecureStoreUtils from './secureStore.utils';

const ACCOUNT_STORAGE_TARGET_VERSION = 3;

const getAccountStorageVersion = async () => {
  const version = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
  );
  return parseInt(version || '0', 10);
};

const getAccounts = async (mk: string) => {
  const version = await getAccountStorageVersion();
  if (version >= ACCOUNT_STORAGE_TARGET_VERSION) {
    return await EncryptedStorageUtils.getFromEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      mk,
    );
  }

  if (version === 2) {
    return await EncryptedStorageUtils.getFromEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      mk,
    );
  }

  const accountsEncrypted = await getFromKeychain('accounts');
  await AsyncStorage.multiSet([
    [KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION, '2'],
    [KeychainStorageKeyEnum.ACCOUNTS, accountsEncrypted],
  ]);
  await clearKeychain('accounts');
  await requireBiometricsLogin(mk, 'encryption.save');
  return decryptToJson(accountsEncrypted, mk);
};

const requireBiometricsLogin = async (mk: string, title: string) => {
  try {
    if (Platform.OS === 'ios') {
      if (!(await LocalAuthentication.isEnrolledAsync())) return;
      navigate('ModalScreen', {
        name: ModalComponent.ENABLE_IOS_BIOMETRICS,
        data: {title: title},
        fixedHeight: 0.35,
      });
    } else {
      saveOnStore(mk, title);
    }
  } catch {}
};

const saveOnStore = async (mk: string, title: string) => {
  await SecureStoreUtils.saveOnSecureStore(
    KeychainStorageKeyEnum.SECURE_MK,
    mk,
    title,
  );
  AsyncStorage.setItem(
    KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
    'true',
  );
};

const migrateAccountsToV3 = async (
  pin: string,
  masterKey: string,
  existingAccounts?: any,
) => {
  const version = await getAccountStorageVersion();
  if (version >= ACCOUNT_STORAGE_TARGET_VERSION) return;

  const legacyAccounts =
    existingAccounts ??
    (await EncryptedStorageUtils.getFromEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      pin,
    ));

  if (legacyAccounts?.list) {
    await EncryptedStorageUtils.saveOnEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      legacyAccounts,
      masterKey,
    );
  }

  const biometricsEnabled =
    (await AsyncStorage.getItem(
      KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
    )) === 'true';
  try {
    await AuthUtils.persistMasterKey(masterKey, biometricsEnabled);
  } catch {
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
      'false',
    );
  }
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
    `${ACCOUNT_STORAGE_TARGET_VERSION}`,
  );
};

const recoverFromFailedPinDecrypt = async (pin: string) => {
  const fallbackMasterKey = await AuthUtils.getMasterKey(false);
  if (!fallbackMasterKey) return null;
  try {
    const fallbackAccounts = await EncryptedStorageUtils.getFromEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      fallbackMasterKey,
    );
    if (!fallbackAccounts?.list) return null;
    await AuthUtils.persistPinSecret(pin);
    const version = await getAccountStorageVersion();
    if (version < ACCOUNT_STORAGE_TARGET_VERSION) {
      await AsyncStorage.setItem(
        KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
        `${ACCOUNT_STORAGE_TARGET_VERSION}`,
      );
    }
    return fallbackMasterKey;
  } catch {
    return null;
  }
};
export enum BiometricsLoginStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  REFUSED = 'REFUSED',
}

const requireBiometricsLoginIOS = async (
  title: string,
  checkAuth: boolean = false,
) => {
  if (Platform.OS !== 'ios') return BiometricsLoginStatus.ENABLED;
  const isBiometricsAvailable = await LocalAuthentication.isEnrolledAsync();
  if (isBiometricsAvailable) {
    let result = {success: true};
    if (!Device.isDevice) {
      result = await LocalAuthentication.authenticateAsync({
        promptMessage: translate(title),
        disableDeviceFallback: true,
      });
    }
    if (!result.success) {
      await AsyncStorage.setItem(
        KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_REFUSED,
        'true',
      );
    }
    return result.success
      ? BiometricsLoginStatus.ENABLED
      : BiometricsLoginStatus.DISABLED;
  } else {
    const isBiometricsLoginRefused = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_REFUSED,
    );

    return isBiometricsLoginRefused === 'true'
      ? BiometricsLoginStatus.REFUSED
      : BiometricsLoginStatus.DISABLED;
  }
};

const StorageUtils = {
  getAccountStorageVersion,
  getAccounts,
  migrateAccountsToV3,
  requireBiometricsLogin,
  requireBiometricsLoginIOS,
  saveOnStore,
  recoverFromFailedPinDecrypt,
};

export default StorageUtils;
