import * as SecureStore from 'expo-secure-store';
import {translate} from '../localize';

const saveOnSecureStore = async (radix: string, string: string) => {
  const chunks = chunkArray(string.split(''), 300).map((e) => e.join(''));
  await SecureStore.setItemAsync(`${radix}_length`, chunks.length.toString(), {
    keychainService: radix,
  });
  for (const [i, chunk] of chunks.entries()) {
    await SecureStore.setItemAsync(
      `${radix}_${i}`,
      chunk,
      i === 0
        ? {
            keychainAccessible: SecureStore.WHEN_UNLOCKED,
            keychainService: radix,
            requireAuthentication: true,
            authenticationPrompt: translate('encryption.save'),
          }
        : {keychainService: radix},
    );
  }
};

const getFromSecureStore = async (radix: string) => {
  let string = '';
  let i = 0;
  const password = await SecureStore.getItemAsync(`${radix}_length`, {
    keychainService: radix,
  });
  if (password) {
    const length = +password;
    while (i < length) {
      try {
        const cred = await SecureStore.getItemAsync(
          `${radix}_${i}`,
          i === 0
            ? {
                keychainService: radix,
                authenticationPrompt: translate('encryption.retrieve'),
                requireAuthentication: true,
                keychainAccessible: SecureStore.WHEN_UNLOCKED,
              }
            : {keychainService: radix},
        );
        if (cred) string += cred;
        i++;
      } catch (e) {
        console.log('e', e);
        throw e;
      }
    }
    return string;
  }
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
