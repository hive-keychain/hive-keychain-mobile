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
}));

jest.mock('utils/authentication.utils', () => ({
  ensureMasterKey: jest.fn(() => 'generated-master-key'),
  ensurePinSecrets: jest.fn(),
  generateMasterKey: jest.fn(() => 'generated-master-key'),
  persistMasterKey: jest.fn(),
  persistPinSecret: jest.fn(),
  verifyPin: jest.fn(),
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

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const unlockAction = actions.unlock(mk, errorCallback);
      await unlockAction(mockDispatch, mockGetState);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update unlock lockout state',
        recordError,
      );
      expect(errorCallback).toHaveBeenCalled();

      consoleSpy.mockRestore();
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
      (StorageUtils.getAccountStorageVersion as jest.Mock).mockResolvedValue(3);
      (AuthUtils.verifyPin as jest.Mock).mockResolvedValue(true);
      (AuthUtils.ensureMasterKey as jest.Mock).mockResolvedValue(
        'generated-master-key',
      );
    });

    it('should unlock when PIN is valid on version 3', async () => {
      const unlockSpy = jest.spyOn(actions, 'unlock');
      const thunk = actions.unlockWithPin('123456');
      await thunk(mockDispatch);
      expect(AuthUtils.verifyPin).toHaveBeenCalledWith('123456');
      expect(mockDispatch).toHaveBeenCalled();
      expect(unlockSpy).toHaveBeenCalled();
    });

    it('should record failure on invalid PIN', async () => {
      (AuthUtils.verifyPin as jest.Mock).mockResolvedValue(false);
      const thunk = actions.unlockWithPin('badpin');
      await thunk(mockDispatch);
      expect(LockoutUtils.recordFailure).toHaveBeenCalled();
    });
  });
});
