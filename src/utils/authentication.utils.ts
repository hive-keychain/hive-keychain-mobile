import CryptoJS from 'crypto-es';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import SecureStoreUtils from './storage/secureStore.utils';

const PIN_PEPPER =
  process.env.EXPO_PUBLIC_PIN_PEPPER || process.env.PIN_PEPPER || '';

const getPepper = () => {
  if (!PIN_PEPPER) {
    console.warn('[auth] Missing PIN pepper env (EXPO_PUBLIC_PIN_PEPPER/PIN_PEPPER)');
  }
  return PIN_PEPPER;
};

const generateSalt = () =>
  CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

const hashPin = (pin: string, salt: string, pepper: string) =>
  CryptoJS.SHA256(`${salt}:${pin}:${pepper}`).toString(CryptoJS.enc.Hex);

const persistPinSecret = async (pin: string) => {
  const salt = generateSalt();
  const hash = hashPin(pin, salt, getPepper());

  await SecureStoreUtils.saveOnSecureStore(
    KeychainStorageKeyEnum.PIN_SALT,
    salt,
    'auth.pin.salt',
    {requireAuthentication: false},
  );
  await SecureStoreUtils.saveOnSecureStore(
    KeychainStorageKeyEnum.PIN_HASH,
    hash,
    'auth.pin.hash',
    {requireAuthentication: false},
  );

  return {salt, hash};
};

const verifyPin = async (pin: string): Promise<boolean> => {
  const [salt, storedHash] = await Promise.all([
    SecureStoreUtils.getFromSecureStore(
      KeychainStorageKeyEnum.PIN_SALT,
      {requireAuthentication: false},
    ),
    SecureStoreUtils.getFromSecureStore(
      KeychainStorageKeyEnum.PIN_HASH,
      {requireAuthentication: false},
    ),
  ]);

  if (!salt || !storedHash) {
    return false;
  }

  const computed = hashPin(pin, salt, getPepper());
  return storedHash === computed;
};

const ensurePinSecrets = async (pin: string) => {
  const [salt, storedHash] = await Promise.all([
    SecureStoreUtils.getFromSecureStore(
      KeychainStorageKeyEnum.PIN_SALT,
      {requireAuthentication: false},
    ),
    SecureStoreUtils.getFromSecureStore(
      KeychainStorageKeyEnum.PIN_HASH,
      {requireAuthentication: false},
    ),
  ]);

  if (salt && storedHash) {
    return {salt, hash: storedHash, created: false};
  }

  const created = await persistPinSecret(pin);
  return {...created, created: true};
};

const generateMasterKey = () =>
  CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

const persistMasterKey = async (
  masterKey: string,
  persistSecureCopy: boolean = false,
) => {
  await SecureStoreUtils.saveOnSecureStore(
    KeychainStorageKeyEnum.MASTER_KEY,
    masterKey,
    'auth.master_key',
    {requireAuthentication: false},
  );

  if (persistSecureCopy) {
    await SecureStoreUtils.saveOnSecureStore(
      KeychainStorageKeyEnum.SECURE_MK,
      masterKey,
      'auth.master_key',
      {requireAuthentication: true},
    );
  }
};

const getMasterKey = async (requireAuthentication = false) => {
  return await SecureStoreUtils.getFromSecureStore(
    requireAuthentication
      ? KeychainStorageKeyEnum.SECURE_MK
      : KeychainStorageKeyEnum.MASTER_KEY,
    {requireAuthentication},
  );
};

const ensureMasterKey = async () => {
  const existing = await getMasterKey(false);
  if (existing) {
    return existing;
  }
  const masterKey = generateMasterKey();
  await persistMasterKey(masterKey, false);
  return masterKey;
};

export const AuthUtils = {
  ensureMasterKey,
  ensurePinSecrets,
  generateMasterKey,
  getMasterKey,
  hashPin,
  persistMasterKey,
  persistPinSecret,
  verifyPin,
};

export default AuthUtils;

