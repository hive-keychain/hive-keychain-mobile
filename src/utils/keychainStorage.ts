import * as Keychain from 'react-native-keychain';
import {chunkArray} from './format';
import {translate} from './localize';

export const saveOnKeychain = async (radix: string, string: string) => {
  const biometrics = await Keychain.getSupportedBiometryType();
  const chunks = chunkArray(string.split(''), 200).map((e) => e.join(''));
  console.log(radix, string, chunks);
  await Keychain.setGenericPassword(radix, chunks.length.toString(), {
    service: radix,
  });
  for (const [i, chunk] of chunks.entries()) {
    const options: Keychain.Options = {
      service: `${radix}_${i}`,
      storage: Keychain.STORAGE_TYPE.FB,
    };
    if (i === 0 && biometrics) {
      options.accessControl =
        Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE;
      options.storage = Keychain.STORAGE_TYPE.RSA;
      options.authenticationType =
        Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS;
      options.accessible = Keychain.ACCESSIBLE.WHEN_UNLOCKED;
    }
    await Keychain.setGenericPassword(radix, chunk, options);
  }
};

export const getFromKeychain = async (radix: string) => {
  let string = '';
  let i = 0;
  const password = await Keychain.getGenericPassword({
    service: radix,
  });
  if (password) {
    const length = +password.password;
    while (i < length) {
      const options: Keychain.Options = {
        service: `${radix}_${i}`,
      };
      if (i === 0) {
        options.authenticationPrompt = {
          title: translate('unlock.authenticate'),
        };
      }
      try {
        const cred = await Keychain.getGenericPassword(options);
        if (cred) string += cred.password;
        i++;
      } catch (e) {
        throw e;
      }
    }
    return string;
  }
};

export const clearKeychain = async (radix: string) => {
  const password = await Keychain.getGenericPassword({
    service: radix,
  });
  if (password) {
    const length = parseInt(password.password);
    let i = 0;
    while (i < length) {
      Keychain.resetGenericPassword({service: `${radix}_${i}`});
      i++;
    }
    await Keychain.resetGenericPassword({service: radix});
  }
};
