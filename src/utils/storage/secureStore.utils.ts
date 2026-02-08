import * as SecureStore from 'expo-secure-store';
import { KeychainStorageKeyEnum } from 'src/enums/keychainStorageKey.enum';
import { translate } from '../localize';

type SecureStoreOptions = {
  requireAuthentication?: boolean;
  authenticationPrompt?: string;
};

const buildOptions = (
  radix: string,
  title?: string,
  options?: SecureStoreOptions,
) => {
  const requireAuthentication =
    options?.requireAuthentication === undefined
      ? true
      : options.requireAuthentication;
  return {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    keychainService: radix,
    requireAuthentication,
    ...(requireAuthentication
      ? {
          authenticationPrompt: translate(
            options?.authenticationPrompt ?? title ?? 'encryption.retrieve',
          ),
        }
      : {}),
  };
};

const saveOnSecureStore = async (
  radix: string,
  string: string,
  title: string,
  options?: SecureStoreOptions,
) => {
  await SecureStore.setItemAsync(
    radix,
    string,
    buildOptions(radix, title, options),
  );
};

const getFromSecureStore = async (
  radix: string,
  options?: SecureStoreOptions,
  title: string = 'encryption.retrieve',
) => {
  return await SecureStore.getItemAsync(
    radix,
    buildOptions(radix, title, options),
  );
};

const deleteFromSecureStore = async (radix: string) => {
  await SecureStore.deleteItemAsync(radix, {
    keychainService: radix,
  });
};

const clearSecureStore = async () => {
  const knownKeys: string[] = [
    KeychainStorageKeyEnum.SECURE_MK,
    KeychainStorageKeyEnum.MASTER_KEY,
    KeychainStorageKeyEnum.PIN_SALT,
    KeychainStorageKeyEnum.PIN_HASH,
    KeychainStorageKeyEnum.LOCKOUT_DATA,
  ];

  const targets: string[] = [...knownKeys];

  await Promise.all(
    targets.map((key) =>
      SecureStore.deleteItemAsync(key, {keychainService: key}),
    ),
  );
};

const SecureStoreUtils = {
  saveOnSecureStore,
  getFromSecureStore,
  deleteFromSecureStore,
  clearSecureStore,
};

export default SecureStoreUtils;
