import * as SecureStore from 'expo-secure-store';
import {translate} from '../localize';

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
