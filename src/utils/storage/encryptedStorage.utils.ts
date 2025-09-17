import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {decryptToJson, encryptJson} from 'utils/encrypt.utils';

const getFromEncryptedStorage = async (
  key: KeychainStorageKeyEnum,
  password: string,
) => {
  const value = await AsyncStorage.getItem(key);
  const decryptedValue = value ? decryptToJson(value, password) : null;
  return decryptedValue;
};

const saveOnEncryptedStorage = async (
  key: KeychainStorageKeyEnum,
  value: any,
  password: string,
) => {
  const encryptedValue = encryptJson(value, password);
  return await AsyncStorage.setItem(key, encryptedValue);
};

const removeFromEncryptedStorage = async (key: KeychainStorageKeyEnum) => {
  await AsyncStorage.removeItem(key);
};

const clearEncryptedStorage = async () => {
  await AsyncStorage.clear();
};

export const EncryptedStorageUtils = {
  getFromEncryptedStorage,
  saveOnEncryptedStorage,
  removeFromEncryptedStorage,
  clearEncryptedStorage,
};
