jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('react-native-root-toast', () => ({
  show: jest.fn(),
  durations: {LONG: 5000},
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('utils/navigation.utils', () => ({
  navigate: jest.fn(),
}));

jest.mock('utils/lockout.utils', () => ({
  checkActiveLockout: jest.fn(),
  reset: jest.fn(),
  recordFailure: jest.fn(),
}));

jest.mock('utils/storage/storage.utils', () => ({
  getAccounts: jest.fn(),
  getAccountStorageVersion: jest.fn(),
  migrateAccountsToV3: jest.fn(),
  recoverFromFailedPinDecrypt: jest.fn(),
}));

jest.mock('utils/authentication.utils', () => ({
  ensureMasterKey: jest.fn(() => 'generated-master-key'),
  ensurePinSecrets: jest.fn(),
  generateMasterKey: jest.fn(() => 'generated-master-key'),
  persistMasterKey: jest.fn(),
  persistPinSecret: jest.fn(),
  verifyPin: jest.fn(),
  verifyPinWithCompatibility: jest.fn(),
}));

jest.mock('src/background', () => ({
  init: jest.fn(),
}));

jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
      activeAccount: {name: 'user1'},
      browser: {shouldFocus: false},
    })),
    dispatch: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import BackGroundUtils from 'src/background';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import AuthUtils from 'utils/authentication.utils';
import LockoutUtils from 'utils/lockout.utils';
import {navigate} from 'utils/navigation.utils';
import StorageUtils from 'utils/storage/storage.utils';
import * as actions from '../index';
import {INIT_ACCOUNTS, LOCK, SIGN_UP, UNLOCK} from '../types';

describe('actions/index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export action creators', () => {
    expect(actions).toBeDefined();
    expect(typeof actions.signUp).toBe('function');
    expect(typeof actions.unlock).toBe('function');
    expect(typeof actions.lock).toBe('function');
  });

  describe('signUp', () => {
    it('should create SIGN_UP action and navigate', async () => {
      const password = 'test-password';
      const mockDispatch = jest.fn();
      const signUpThunk = actions.signUp(password);

      await signUpThunk(mockDispatch, jest.fn(), undefined);

      expect(AuthUtils.persistPinSecret).toHaveBeenCalledWith(password);
      expect(AuthUtils.persistMasterKey).toHaveBeenCalledWith(
        'generated-master-key',
        false,
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: SIGN_UP,
        payload: 'generated-master-key',
      });
      expect(navigate).toHaveBeenCalledWith('ChooseAccountOptionsScreen');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
        '3',
      );
    });
  });

  describe('lock', () => {
    it('should create LOCK action', () => {
      const result = actions.lock();

      expect(result).toEqual({
        type: LOCK,
      });
    });
  });

  describe('unlock', () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn();

    beforeEach(() => {
      mockDispatch.mockClear();
      mockGetState.mockReturnValue({
        browser: {shouldFocus: false},
      });
    });

    it('should unlock successfully and dispatch actions', async () => {
      const mk = 'master-key';
      const mockAccounts = {
        list: [
          {name: 'user1', keys: {active: 'key1'}},
          {name: 'user2', keys: {active: 'key2'}},
        ],
      };

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockResolvedValue(mockAccounts);
      (LockoutUtils.reset as jest.Mock).mockResolvedValue(undefined);

      const unlockAction = actions.unlock(mk);
      await unlockAction(mockDispatch, mockGetState);

      expect(LockoutUtils.checkActiveLockout).toHaveBeenCalled();
      expect(StorageUtils.getAccounts).toHaveBeenCalledWith(mk);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UNLOCK,
        payload: mk,
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: INIT_ACCOUNTS,
        payload: {accounts: mockAccounts.list},
      });
      expect(BackGroundUtils.init).toHaveBeenCalledWith(mockAccounts.list);
      expect(LockoutUtils.reset).toHaveBeenCalled();
    });

    it('should call errorCallback when locked out', async () => {
      const mk = 'master-key';
      const errorCallback = jest.fn();

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(true);

      const unlockAction = actions.unlock(mk, errorCallback);
      await unlockAction(mockDispatch, mockGetState);

      expect(LockoutUtils.checkActiveLockout).toHaveBeenCalled();
      expect(StorageUtils.getAccounts).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should navigate to Browser when shouldFocus is true', async () => {
      const mk = 'master-key';
      const mockAccounts = {
        list: [{name: 'user1', keys: {active: 'key1'}}],
      };

      mockGetState.mockReturnValue({
        browser: {shouldFocus: true},
      });

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockResolvedValue(mockAccounts);
      (LockoutUtils.reset as jest.Mock).mockResolvedValue(undefined);

      const unlockAction = actions.unlock(mk);
      await unlockAction(mockDispatch, mockGetState);

      expect(navigate).toHaveBeenCalledWith('Browser');
    });

    it('should handle authentication error', async () => {
      const mk = 'master-key';
      const errorCallback = jest.fn();
      const authError = new Error('Wrapped error: User not authenticated');

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockRejectedValue(authError);

      const unlockAction = actions.unlock(mk, errorCallback);
      await unlockAction(mockDispatch, mockGetState);

      expect(errorCallback).toHaveBeenCalledWith(true);
      expect(Toast.show).not.toHaveBeenCalled();
    });

    it('should handle other errors and show toast', async () => {
      const mk = 'master-key';
      const errorCallback = jest.fn();
      const error = new Error('Some other error');

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockRejectedValue(error);
      (LockoutUtils.recordFailure as jest.Mock).mockResolvedValue(undefined);

      const unlockAction = actions.unlock(mk, errorCallback);
      await unlockAction(mockDispatch, mockGetState);

      expect(Toast.show).toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(LockoutUtils.recordFailure).toHaveBeenCalled();
    });

    it('should handle recordFailure error gracefully', async () => {
      const mk = 'master-key';
      const errorCallback = jest.fn();
      const error = new Error('Storage error');
      const recordError = new Error('Record failure error');

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockRejectedValue(error);
      (LockoutUtils.recordFailure as jest.Mock).mockRejectedValue(recordError);

      const unlockAction = actions.unlock(mk, errorCallback);
      await unlockAction(mockDispatch, mockGetState);

      expect(LockoutUtils.recordFailure).toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
    });

    it('should handle error when errorCallback is not provided', async () => {
      const mk = 'master-key';
      const error = new Error('Some error');

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockRejectedValue(error);
      (LockoutUtils.recordFailure as jest.Mock).mockResolvedValue(undefined);

      const unlockAction = actions.unlock(mk);
      await unlockAction(mockDispatch, mockGetState);

      expect(Toast.show).toHaveBeenCalled();
    });

    it('should handle case when accounts is null', async () => {
      const mk = 'master-key';

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockResolvedValue(null);

      const unlockAction = actions.unlock(mk);
      await unlockAction(mockDispatch, mockGetState);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(BackGroundUtils.init).not.toHaveBeenCalled();
    });

    it('should handle case when accounts.list is missing', async () => {
      const mk = 'master-key';

      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccounts as jest.Mock).mockResolvedValue({});

      const unlockAction = actions.unlock(mk);
      await unlockAction(mockDispatch, mockGetState);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(BackGroundUtils.init).not.toHaveBeenCalled();
    });
  });

  describe('unlockWithPin', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(false);
      (StorageUtils.getAccountStorageVersion as jest.Mock).mockResolvedValue(3);
      (AuthUtils.verifyPinWithCompatibility as jest.Mock).mockResolvedValue({
        isValid: true,
        shouldMigrateToPeppered: false,
      });
      (AuthUtils.ensureMasterKey as jest.Mock).mockResolvedValue(
        'generated-master-key',
      );
    });

    it('should unlock when PIN is valid on version 3', async () => {
      const unlockSpy = jest.spyOn(actions, 'unlock');
      const thunk = actions.unlockWithPin('123456');
      await thunk(mockDispatch);
      expect(AuthUtils.verifyPinWithCompatibility).toHaveBeenCalledWith('123456');
      expect(AuthUtils.persistPinSecret).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(unlockSpy).toHaveBeenCalled();
      unlockSpy.mockRestore();
    });

    it('should migrate PIN hash when a legacy unpeppered hash matches', async () => {
      (AuthUtils.verifyPinWithCompatibility as jest.Mock).mockResolvedValue({
        isValid: true,
        shouldMigrateToPeppered: true,
      });

      const unlockSpy = jest.spyOn(actions, 'unlock');
      const thunk = actions.unlockWithPin('123456');
      await thunk(mockDispatch);

      expect(AuthUtils.verifyPinWithCompatibility).toHaveBeenCalledWith('123456');
      expect(AuthUtils.persistPinSecret).toHaveBeenCalledWith('123456');
      expect(unlockSpy).toHaveBeenCalled();
      unlockSpy.mockRestore();
    });

    it('should record failure on invalid PIN', async () => {
      (AuthUtils.verifyPinWithCompatibility as jest.Mock).mockResolvedValue({
        isValid: false,
        shouldMigrateToPeppered: false,
      });
      const thunk = actions.unlockWithPin('badpin');
      await thunk(mockDispatch);
      expect(LockoutUtils.recordFailure).toHaveBeenCalled();
      expect(AuthUtils.persistPinSecret).not.toHaveBeenCalled();
    });

    it('should call errorCallback when lockout is active', async () => {
      (LockoutUtils.checkActiveLockout as jest.Mock).mockResolvedValue(true);
      const cb = jest.fn();
      await actions.unlockWithPin('1', cb)(mockDispatch);
      expect(cb).toHaveBeenCalled();
      expect(AuthUtils.verifyPinWithCompatibility).not.toHaveBeenCalled();
    });

    it('migrates legacy accounts when storage version is below 3', async () => {
      (StorageUtils.getAccountStorageVersion as jest.Mock).mockResolvedValue(2);
      (StorageUtils.getAccounts as jest.Mock).mockResolvedValue({
        list: [{name: 'alice'}],
      });
      (AuthUtils.persistPinSecret as jest.Mock).mockResolvedValue(undefined);
      (StorageUtils.migrateAccountsToV3 as jest.Mock).mockResolvedValue(
        undefined,
      );

      const unlockSpy = jest.spyOn(actions, 'unlock');
      await actions.unlockWithPin('9999')(mockDispatch);

      expect(AuthUtils.persistPinSecret).toHaveBeenCalledWith('9999');
      expect(StorageUtils.migrateAccountsToV3).toHaveBeenCalledWith(
        '9999',
        'generated-master-key',
        {list: [{name: 'alice'}]},
      );
      expect(unlockSpy).toHaveBeenCalled();
      unlockSpy.mockRestore();
    });

    it('uses recovered master key when legacy decrypt fails', async () => {
      (StorageUtils.getAccountStorageVersion as jest.Mock).mockResolvedValue(2);
      (StorageUtils.getAccounts as jest.Mock).mockRejectedValue(
        new Error('decrypt'),
      );
      (StorageUtils.recoverFromFailedPinDecrypt as jest.Mock).mockResolvedValue(
        'recovered-mk',
      );

      const unlockSpy = jest.spyOn(actions, 'unlock');
      await actions.unlockWithPin('8888')(mockDispatch);

      expect(StorageUtils.recoverFromFailedPinDecrypt).toHaveBeenCalledWith(
        '8888',
      );
      expect(unlockSpy).toHaveBeenCalledWith('recovered-mk', undefined);
      expect(AuthUtils.persistPinSecret).not.toHaveBeenCalled();
      unlockSpy.mockRestore();
    });

    it('shows toast when legacy account cannot be recovered', async () => {
      (StorageUtils.getAccountStorageVersion as jest.Mock).mockResolvedValue(2);
      (StorageUtils.getAccounts as jest.Mock).mockResolvedValue(null);
      (StorageUtils.recoverFromFailedPinDecrypt as jest.Mock).mockResolvedValue(
        null,
      );

      await actions.unlockWithPin('7777')(mockDispatch);

      expect(Toast.show).toHaveBeenCalled();
      expect(LockoutUtils.recordFailure).toHaveBeenCalled();
    });

    it('records failure on unexpected error', async () => {
      (LockoutUtils.checkActiveLockout as jest.Mock).mockRejectedValue(
        new Error('unexpected'),
      );
      const cb = jest.fn();
      await actions.unlockWithPin('1', cb)(mockDispatch);
      expect(LockoutUtils.recordFailure).toHaveBeenCalled();
      expect(cb).toHaveBeenCalled();
    });
  });
});
