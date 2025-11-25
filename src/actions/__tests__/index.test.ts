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
    it('should create SIGN_UP action and navigate', () => {
      const password = 'test-password';
      const result = actions.signUp(password);

      expect(result).toEqual({
        type: SIGN_UP,
        payload: password,
      });
      expect(navigate).toHaveBeenCalledWith('ChooseAccountOptionsScreen');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
        '2',
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

      // The code will throw if errorCallback is not provided, so we need to catch it
      const unlockAction = actions.unlock(mk);

      // The code calls errorCallback() unconditionally, so it will throw
      // This test documents the current behavior
      await expect(unlockAction(mockDispatch, mockGetState)).rejects.toThrow();

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
});
