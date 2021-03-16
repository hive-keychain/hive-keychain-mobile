import * as Keychain from 'react-native-keychain';
import {chunkArray} from 'utils/format';
import {translate} from 'utils/localize';

export const saveOnKeychain = async (radix, string) => {
  const biometrics = await Keychain.getSupportedBiometryType();
  const chunks = chunkArray(string.split(''), 300).map((e) => e.join(''));
  await Keychain.setGenericPassword(radix, chunks.length.toString(), {
    service: radix,
  });
  for (const [i, chunk] of chunks.entries()) {
    const options = {
      service: `${radix}_${i}`,
      storage: Keychain.STORAGE_TYPE.FB,
    };
    if (i === 0 && biometrics) {
      options.accessControl =
        Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE;
      options.storage = Keychain.STORAGE_TYPE.RSA;
      options.authenticationType =
        Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS;
      options.accessible = Keychain.WHEN_UNLOCKED;
    }
    await Keychain.setGenericPassword(radix, chunk, options);
  }
};

export const getFromKeychain = async (radix) => {
  let string = '';
  let i = 0;
  const password = await Keychain.getGenericPassword({
    service: radix,
  });
  const length = password.password;
  while (i < length) {
    const options = {
      service: `${radix}_${i}`,
    };
    if (i === 0) {
      options.authenticationPrompt = {title: translate('unlock.authenticate')};
    }
    try {
      const cred = await Keychain.getGenericPassword(options);
      string += cred.password;
      i++;
    } catch (e) {
      console.log(e);
    }
  }
  return string;
};

export const clearKeychain = async (radix) => {
  const password = await Keychain.getGenericPassword({
    service: radix,
  });
  const length = password.password;
  let i = 0;
  while (i < length) {
    await Keychain.resetGenericPassword(`${radix}_${i}`);
    i++;
  }
  await Keychain.resetGenericPassword(radix);
};
