import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {decryptToJson} from 'utils/encrypt.utils';
import {EncryptedStorageUtils} from './encryptedStorage.utils';
import {clearKeychain, getFromKeychain} from './keychainStorage.utils';
import SecureStoreUtils from './secureStore.utils';

const getAccounts = async (mk: string) => {
  const version = +(await AsyncStorage.getItem(
    KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
  ));
  if (version === 2) {
    console.log('accounts from new storage');

    return await EncryptedStorageUtils.getFromEncryptedStorage(
      KeychainStorageKeyEnum.ACCOUNTS,
      mk,
    );
  } else {
    const accountsEncrypted = await getFromKeychain('accounts');
    await AsyncStorage.multiSet([
      [KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION, '2'],
      [KeychainStorageKeyEnum.ACCOUNTS, accountsEncrypted],
    ]);
    await clearKeychain('accounts');
    await requireBiometricsLogin(mk);
    console.log('migratin old accounts to new storage');
    return decryptToJson(accountsEncrypted, mk);
  }
};

const requireBiometricsLogin = async (mk: string) => {
  try {
    await SecureStoreUtils.saveOnSecureStore(
      KeychainStorageKeyEnum.SECURE_MK,
      mk,
    );
    AsyncStorage.setItem(
      KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
      'true',
    );
  } catch (error) {
    console.log('Refused biometrics encryption');
  }
};

const StorageUtils = {
  getAccounts,
  requireBiometricsLogin,
};

export default StorageUtils;
