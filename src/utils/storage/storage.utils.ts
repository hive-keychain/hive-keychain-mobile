import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {Platform} from 'react-native';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {ModalComponent} from 'src/enums/modal.enum';
import {decryptToJson} from 'utils/encrypt.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';
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
    //Instead, show the modal and ask in there.
    await requireBiometricsLogin(mk, 'encryption.save');
    console.log('migratin old accounts to new storage');
    return decryptToJson(accountsEncrypted, mk);
  }
};

const requireBiometricsLogin = async (mk: string, title: string) => {
  try {
    if (Platform.OS === 'ios') {
      navigate('ModalScreen', {
        name: ModalComponent.ENABLE_IOS_BIOMETRICS,
        data: {title: translate(title)},
        fixedHeight: 0.35,
      });
    } else {
      saveOnStore(mk, title);
    }
  } catch (error) {
    console.log('Refused biometrics encryption');
  }
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
export enum BiometricsLoginStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  REFUSED = 'REFUSED',
}

const requireBiometricsLoginIOS = async (title: string) => {
  if (Platform.OS !== 'ios') return BiometricsLoginStatus.ENABLED;
  const isBiometricsAvailable = await LocalAuthentication.isEnrolledAsync();
  if (isBiometricsAvailable) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: translate(title),
      disableDeviceFallback: true,
    });
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
  getAccounts,
  requireBiometricsLogin,
  requireBiometricsLoginIOS,
  saveOnStore,
};

export default StorageUtils;
