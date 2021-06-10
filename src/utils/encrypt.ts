//import CryptoJS from 'react-native-crypto-js';
import CryptoJS from 'crypto-js';
import md5 from 'md5';
// AES implementation using cryptojs

const keySize = 256;
const iterations = 100;

interface EncryptionJson {
  hash: string;
  list: any[];
}
// We add an md5 hash to check if decryption is successful later on.
export const encryptJson = (json: EncryptionJson, pwd: string) => {
  json.hash = md5(json.list);
  var msg = encrypt(JSON.stringify(json), pwd);
  return msg;
};

// Decrypt and check the hash to confirm the decryption
export const decryptToJson = (msg: string, pwd: string) => {
  try {
    let decrypted = decrypt(msg, pwd).toString(CryptoJS.enc.Utf8);

    decrypted = JSON.parse(decrypted);

    if (decrypted.hash && decrypted.hash === md5(decrypted.list)) {
      return decrypted as EncryptionJson;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    throw new Error('Unable to decrypt');
  }
};

// AES encryption with master password
const encrypt = (msg: string, pass: string) => {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
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
const decrypt = (transitmessage: string, pass: string) => {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var encrypted = transitmessage.substring(64);
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
};
