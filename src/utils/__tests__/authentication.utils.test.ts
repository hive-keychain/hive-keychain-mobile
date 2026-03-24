import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import AuthUtils from '../authentication.utils';
import SecureStoreUtils from '../storage/secureStore.utils';

jest.mock('../storage/secureStore.utils', () => ({
  __esModule: true,
  default: {
    saveOnSecureStore: jest.fn(),
    getFromSecureStore: jest.fn(),
  },
}));

/** Matches `authentication.utils` pepper resolution at module load (see PIN_PEPPER). */
const pepper = () =>
  process.env.EXPO_PUBLIC_PIN_PEPPER || process.env.PIN_PEPPER || '';

describe('authentication.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPin', () => {
    it('should be deterministic for the same inputs', () => {
      const a = AuthUtils.hashPin('1234', 'salt', 'pepper');
      const b = AuthUtils.hashPin('1234', 'salt', 'pepper');
      expect(a).toBe(b);
      expect(a).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('persistPinSecret', () => {
    it('should store salt and hash and return them', async () => {
      (SecureStoreUtils.saveOnSecureStore as jest.Mock).mockResolvedValue(
        undefined,
      );

      const out = await AuthUtils.persistPinSecret('9999');

      expect(out.salt).toBeTruthy();
      expect(out.hash).toBe(AuthUtils.hashPin('9999', out.salt, pepper()));
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.PIN_SALT,
        out.salt,
        'auth.pin.salt',
        {requireAuthentication: false},
      );
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.PIN_HASH,
        out.hash,
        'auth.pin.hash',
        {requireAuthentication: false},
      );
    });
  });

  describe('verifyPin', () => {
    it('returns false when salt or hash is missing', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockImplementation(
        (key: string) =>
          key === KeychainStorageKeyEnum.PIN_SALT
            ? Promise.resolve(null)
            : Promise.resolve('hash'),
      );

      await expect(AuthUtils.verifyPin('1')).resolves.toBe(false);
    });

    it('returns false when computed hash does not match', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockImplementation(
        (key: string) => {
          if (key === KeychainStorageKeyEnum.PIN_SALT) {
            return Promise.resolve('s');
          }
          return Promise.resolve('deadbeef');
        },
      );

      await expect(AuthUtils.verifyPin('wrong')).resolves.toBe(false);
    });

    it('returns true when pin matches stored hash', async () => {
      const salt = 'abc';
      const hash = AuthUtils.hashPin('4242', salt, pepper());
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockImplementation(
        (key: string) => {
          if (key === KeychainStorageKeyEnum.PIN_SALT) {
            return Promise.resolve(salt);
          }
          return Promise.resolve(hash);
        },
      );

      await expect(AuthUtils.verifyPin('4242')).resolves.toBe(true);
    });
  });

  describe('ensurePinSecrets', () => {
    it('returns existing secrets without creating new ones', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockImplementation(
        (key: string) =>
          key === KeychainStorageKeyEnum.PIN_SALT
            ? Promise.resolve('s')
            : Promise.resolve('h'),
      );

      const out = await AuthUtils.ensurePinSecrets('1111');

      expect(out).toEqual({salt: 's', hash: 'h', created: false});
      expect(SecureStoreUtils.saveOnSecureStore).not.toHaveBeenCalled();
    });

    it('creates secrets when missing', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockResolvedValue(null);
      (SecureStoreUtils.saveOnSecureStore as jest.Mock).mockResolvedValue(
        undefined,
      );

      const out = await AuthUtils.ensurePinSecrets('2222');

      expect(out.created).toBe(true);
      expect(out.salt).toBeTruthy();
      expect(out.hash).toBeTruthy();
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalled();
    });
  });

  describe('persistMasterKey', () => {
    it('saves only master key when persistSecureCopy is false', async () => {
      (SecureStoreUtils.saveOnSecureStore as jest.Mock).mockResolvedValue(
        undefined,
      );

      await AuthUtils.persistMasterKey('mk', false);

      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledTimes(1);
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.MASTER_KEY,
        'mk',
        'encryption.save',
        {requireAuthentication: false},
      );
    });

    it('saves secure copy when persistSecureCopy is true', async () => {
      (SecureStoreUtils.saveOnSecureStore as jest.Mock).mockResolvedValue(
        undefined,
      );

      await AuthUtils.persistMasterKey('mk', true);

      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledTimes(2);
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.SECURE_MK,
        'mk',
        'encryption.save',
        {requireAuthentication: true},
      );
    });
  });

  describe('getMasterKey', () => {
    it('reads MASTER_KEY when requireAuthentication is false', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockResolvedValue('mk');

      const v = await AuthUtils.getMasterKey(false);

      expect(v).toBe('mk');
      expect(SecureStoreUtils.getFromSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.MASTER_KEY,
        {requireAuthentication: false},
      );
    });

    it('reads SECURE_MK when requireAuthentication is true', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockResolvedValue('smk');

      const v = await AuthUtils.getMasterKey(true);

      expect(v).toBe('smk');
      expect(SecureStoreUtils.getFromSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.SECURE_MK,
        {requireAuthentication: true},
      );
    });
  });

  describe('ensureMasterKey', () => {
    it('returns existing master key', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockResolvedValue(
        'existing',
      );

      await expect(AuthUtils.ensureMasterKey()).resolves.toBe('existing');
      expect(SecureStoreUtils.saveOnSecureStore).not.toHaveBeenCalled();
    });

    it('generates and persists when none stored', async () => {
      (SecureStoreUtils.getFromSecureStore as jest.Mock).mockResolvedValue(null);
      (SecureStoreUtils.saveOnSecureStore as jest.Mock).mockResolvedValue(
        undefined,
      );

      const mk = await AuthUtils.ensureMasterKey();

      expect(mk).toBeTruthy();
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.MASTER_KEY,
        mk,
        'encryption.save',
        {requireAuthentication: false},
      );
    });
  });

  describe('generateMasterKey', () => {
    it('returns a 64-char hex string', () => {
      const k = AuthUtils.generateMasterKey();
      expect(k).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
