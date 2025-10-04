import CryptoJS from 'crypto-es';
import md5 from 'md5';
import {Platform} from 'react-native';
// AES implementation using cryptojs

const keySize = 256;
const ITERATIONS_SHA1 = 100;
const ITERATIONS_SHA256 = Platform.OS === 'android' ? 1000 : 5000;

enum Hasher {
  SHA256 = 'sha256',
  SHA1 = 'sha1',
}
interface EncryptionJson {
  hash?: string;
  list: any[];
}
// We add an md5 hash to check if decryption is successful later on.
export const encryptJson = (json: EncryptionJson, pwd: string) => {
  json.hash = md5(json.list);
  var msg = encrypt(JSON.stringify(json), pwd);
  return msg;
};

// Decrypt and check the hash to confirm the decryption
export const decryptToJson = (
  msg: string,
  pwd: string,
  hasher: Hasher = Hasher.SHA256,
): any => {
  try {
    let decryptedString = decrypt(msg, pwd, hasher).toString(CryptoJS.enc.Utf8);
    let decrypted = JSON.parse(decryptedString) as EncryptionJson;

    if (decrypted.hash && decrypted.hash === md5(decrypted.list)) {
      return decrypted as EncryptionJson;
    } else {
      return null;
    }
  } catch (e) {
    if (hasher === Hasher.SHA256) {
      return decryptToJson(msg, pwd, Hasher.SHA1);
    }
    console.log(e);
    throw new Error('Unable to decrypt');
  }
};

// AES encryption with master password
const encrypt = (msg: string, pass: string, hasher: Hasher = Hasher.SHA256) => {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: ITERATIONS_SHA256,
    hasher: CryptoJS.algo.SHA256,
  });
  var iv = CryptoJS.lib.WordArray.random(128 / 8);
  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
};

// AES decryption with master password
const decrypt = (
  transitmessage: string,
  pass: string,
  hasher: Hasher = Hasher.SHA256,
) => {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var encrypted = transitmessage.substring(64);
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: hasher === Hasher.SHA256 ? ITERATIONS_SHA256 : ITERATIONS_SHA1,
    hasher:
      hasher === Hasher.SHA256 ? CryptoJS.algo.SHA256 : CryptoJS.algo.SHA1,
  });
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
};
