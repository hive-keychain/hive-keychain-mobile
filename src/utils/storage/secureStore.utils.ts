import * as SecureStore from 'expo-secure-store';
import {translate} from '../localize';

const saveOnSecureStore = async (
  radix: string,
  string: string,
  title: string,
) => {
  await SecureStore.setItemAsync(radix, string, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
    keychainService: radix,
    requireAuthentication: true,
    authenticationPrompt: translate(title),
  });
};

const getFromSecureStore = async (radix: string) => {
  return await SecureStore.getItemAsync(radix, {
    keychainService: radix,
    authenticationPrompt: translate('encryption.retrieve'),
    requireAuthentication: true,
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};

const deleteFromSecureStore = async (radix: string) => {
  await SecureStore.deleteItemAsync(radix, {
    keychainService: radix,
  });
};

const clearSecureStore = async (radix: string) => {
  const password = await SecureStore.getItemAsync(`${radix}_length`, {
    keychainService: radix,
  });
  const length = parseInt(password || '0');
  let i = 0;
  while (i < length) {
    await SecureStore.deleteItemAsync(`${radix}_${i}`, {
      keychainService: radix,
    });
    i++;
  }
  await SecureStore.deleteItemAsync(`${radix}_length`, {
    keychainService: radix,
  });
};

const chunkArray = (myArray: any[], chunk_size: number) => {
  const arrayLength = myArray.length;
  let tempArray = [];

  for (let index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size);
    tempArray.push(myChunk);
  }

  return tempArray;
};

const SecureStoreUtils = {
  saveOnSecureStore,
  getFromSecureStore,
  deleteFromSecureStore,
  clearSecureStore,
};

export default SecureStoreUtils;
