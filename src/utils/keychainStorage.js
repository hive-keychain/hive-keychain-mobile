import * as Keychain from 'react-native-keychain';
import {chunkArray} from 'utils/format';

export const saveOnKeychain = async (radix, string) => {
  const chunks = chunkArray(string.split(''), 300).map((e) => e.join(''));
  await Keychain.setGenericPassword(radix, chunks.length.toString(), {
    service: radix,
  });
  for (const [i, chunk] of chunks.entries()) {
    const options = {
      service: `${radix}_${i}`,
      storage: Keychain.STORAGE_TYPE.FB,
    };
    if (i === 0) {
      options.accessControl =
        Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE;
      options.storage = Keychain.STORAGE_TYPE.RSA;
    }
    await Keychain.setGenericPassword(radix, chunk, options);
  }
};

// export const saveOnKeychain = async (radix, string) => {
//   const chunks = chunkArray(string.split(''), 300).map((e) => e.join(''));
//   //await clearKeychain(getState());
//   for (const [i, chunk] of chunks.entries()) {
//     console.log({service: `${radix}_${i}`});
//     await Keychain.setGenericPassword(`${radix}_${chunks.length}`, chunk, {
//       accessControl:
//         i === 0
//           ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE
//           : null,
//       service: `${radix}_${i}`,
//       storage: Keychain.STORAGE_TYPE.RSA,
//     });
//   }
// };

export const getFromKeychain = async (radix) => {
  let string = '';
  let i = 0;
  const length = (
    await Keychain.getGenericPassword({
      service: radix,
    })
  ).password;
  while (i < length) {
    const options = {
      service: `${radix}_${i}`,
    };
    if (i === 0) {
      options.authenticationPrompt = {title: 'Authenticate'};
    }
    const cred = await Keychain.getGenericPassword(options);
    string += cred.password;
    i++;
  }
  return string;
};

// export const getFromKeychain = async (radix) => {
//   let string = '';
//   let i = 0;
//   let length = 10;
//   while (i < length) {
//     const cred = await Keychain.getGenericPassword({
//       service: `${radix}_${i}`,
//       authenticationPrompt: {title: 'Authenticate'},
//     });
//     console.log(cred);
//     if (i === 0) {
//       length = cred.username.replace(`${radix}_`, '');
//     }
//     string += cred.password;
//     i++;
//   }
//   return string;
// };

export const clearKeychain = async (length) => {
  // console.log(state);
  // const mk = state.auth.mk;
  // const accounts = state.accounts;
  // console.log(accounts);
  // const encrypted = encryptJson({list: accounts}, mk);
  // const length = Math.ceil(encrypted.length / 300);
  let i = 0;
  let services = [];
  while (i < length) {
    services.push({service: `accounts_${i}`});
    i++;
  }
  for (const s of services) {
    await Keychain.resetGenericPassword(s);
  }
};
