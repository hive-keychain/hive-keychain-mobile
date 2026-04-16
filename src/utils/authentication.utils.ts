import CryptoJS from 'crypto-es';
import { KeychainStorageKeyEnum } from 'src/enums/keychainStorageKey.enum';
import SecureStoreUtils from './storage/secureStore.utils';

const PIN_PEPPER =
  process.env.EXPO_PUBLIC_PIN_PEPPER || process.env.PIN_PEPPER || '';

const getPepper = () => PIN_PEPPER;

export enum PinVerificationStatus {
  MATCHED_PEPPERED = 'MATCHED_PEPPERED',
  MATCHED_LEGACY_UNPEPPERED = 'MATCHED_LEGACY_UNPEPPERED',
  MISSING_SECRETS = 'MISSING_SECRETS',
  MISMATCH = 'MISMATCH',
}

export interface PinVerificationResult {
  status: PinVerificationStatus;
  isValid: boolean;
  shouldMigrateToPeppered: boolean;
}

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

const verifyPinWithCompatibility = async (
  pin: string,
): Promise<PinVerificationResult> => {
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
    return {
      status: PinVerificationStatus.MISSING_SECRETS,
      isValid: false,
      shouldMigrateToPeppered: false,
    };
  }

  const pepper = getPepper();
  const pepperedHash = hashPin(pin, salt, pepper);

  if (storedHash === pepperedHash) {
    return {
      status: PinVerificationStatus.MATCHED_PEPPERED,
      isValid: true,
      shouldMigrateToPeppered: false,
    };
  }

  if (pepper !== '') {
    const unpepperedHash = hashPin(pin, salt, '');
    if (storedHash === unpepperedHash) {
      return {
        status: PinVerificationStatus.MATCHED_LEGACY_UNPEPPERED,
        isValid: true,
        shouldMigrateToPeppered: true,
      };
    }
  }

  return {
    status: PinVerificationStatus.MISMATCH,
    isValid: false,
    shouldMigrateToPeppered: false,
  };
};

const verifyPin = async (pin: string): Promise<boolean> => {
  const result = await verifyPinWithCompatibility(pin);
  return result.isValid;
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
    'encryption.save',
    {requireAuthentication: false},
  );

  if (persistSecureCopy) {
    await SecureStoreUtils.saveOnSecureStore(
      KeychainStorageKeyEnum.SECURE_MK,
      masterKey,
      'encryption.save',
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
  verifyPinWithCompatibility,
};

export default AuthUtils;
