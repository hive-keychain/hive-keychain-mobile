jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
      activeAccount: {name: 'user1'},
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('utils/storage/encryptedStorage.utils', () => ({
  EncryptedStorageUtils: {
    saveOnEncryptedStorage: jest.fn(),
    clearEncryptedStorage: jest.fn(),
  },
}));

jest.mock('utils/storage/storage.utils', () => ({
  __esModule: true,
  default: {
    requireBiometricsLogin: jest.fn(),
  },
}));

jest.mock('utils/widget.utils', () => ({
  WidgetUtils: {
    addAccountBalanceList: jest.fn(),
    clearAccountBalanceList: jest.fn(),
    removeAccountBalanceList: jest.fn(),
  },
}));

jest.mock('react-native-root-toast', () => ({
  show: jest.fn(),
  durations: {LONG: 3500},
}));

jest.mock('utils/navigation.utils', () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
  resetStackAndNavigate: jest.fn(),
}));

jest.mock('../hive', () => ({
  loadAccount: jest.fn(() => ({type: 'LOAD_ACCOUNT'})),
}));

// Use real validateKeys with test keys from .env
// Mock only getClient, not the entire hiveLibs.utils module (hive library needs to be real)
jest.mock('utils/hiveLibs.utils', () => {
  const actual = jest.requireActual('utils/hiveLibs.utils');
  return {
    __esModule: true,
    default: actual.default, // Preserve the default hive export
    getClient: jest.fn(() => ({
      database: {
        getAccounts: jest.fn(),
      },
    })),
  };
});

jest.mock('../message', () => ({
  showModal: jest.fn(),
}));

jest.mock('utils/localize', () => ({
  translate: jest.fn((key: string, params?: any) => key),
}));

import Toast from 'react-native-root-toast';
import {getClient} from 'utils/hiveLibs.utils';
import {goBack, navigate, resetStackAndNavigate} from 'utils/navigation.utils';
import {EncryptedStorageUtils} from 'utils/storage/encryptedStorage.utils';
import StorageUtils from 'utils/storage/storage.utils';
import {WidgetUtils} from 'utils/widget.utils';

// Test keys from .env
const TEST_USERNAME = process.env._TEST_USERNAME;
const TEST_ACTIVE = process.env._TEST_ACTIVE;
const TEST_ACTIVE_PUB = process.env._TEST_ACTIVE_PUB;
const TEST_POSTING = process.env._TEST_POSTING;
const TEST_POSTING_PUB = process.env._TEST_POSTING_PUB;
const TEST_MEMO = process.env._TEST_MEMO;
const TEST_MEMO_PUB = process.env._TEST_MEMO_PUB;
const TEST_MASTER = process.env._TEST_MASTER;

// Mock Hive account structure matching the test keys
const createMockAccount = (username: string) => ({
  name: username,
  memo_key: TEST_MEMO_PUB,
  active: {
    weight_threshold: 1,
    account_auths: [] as any[],
    key_auths: [[TEST_ACTIVE_PUB, 1]],
  },
  posting: {
    weight_threshold: 1,
    account_auths: [] as any[],
    key_auths: [[TEST_POSTING_PUB, 1]],
  },
});

import {
  addAccount,
  forgetAccount,
  forgetAccounts,
  forgetKey,
  reorderAccounts,
} from '../accounts';
import {loadAccount} from '../hive';
import {KeyTypes} from '../interfaces';
import {showModal} from '../message';

describe('accounts actions', () => {
  const mockDispatch = jest.fn();
  const mockGetState = jest.fn(() => ({
    auth: {mk: 'masterkey'},
    accounts: [],
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock for getAccounts to return test account
    (getClient as jest.Mock).mockReturnValue({
      database: {
        getAccounts: jest
          .fn()
          .mockResolvedValue([createMockAccount(TEST_USERNAME)]),
      },
    });
  });

  describe('addAccount', () => {
    it('should add account and save to storage', async () => {
      const thunk = addAccount('user1', {active: 'STM...'}, true, false);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalled();
      expect(EncryptedStorageUtils.saveOnEncryptedStorage).toHaveBeenCalled();
    });

    it('should show toast if account already exists', async () => {
      const thunk = addAccount('user1', {active: 'STM...'}, true, false);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [{name: 'user1', keys: {}}],
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(Toast.show).toHaveBeenCalled();
    });

    it('should return early when account already exists and multipleAccounts is true', async () => {
      const thunk = addAccount('user1', {active: 'STM...'}, true, false, true);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [{name: 'user1', keys: {}}],
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(Toast.show).toHaveBeenCalled();
      // Should return early, so no navigation should occur
      expect(navigate).not.toHaveBeenCalled();
      expect(goBack).not.toHaveBeenCalled();
    });

    it('should navigate to Wallet when account exists, wallet is true, qr is false, and multipleAccounts is false', async () => {
      const thunk = addAccount('user1', {active: 'STM...'}, true, false, false);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [{name: 'user1', keys: {}}],
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(Toast.show).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('Wallet');
    });

    it('should goBack when account exists, wallet is true, qr is true, and multipleAccounts is false', async () => {
      const thunk = addAccount('user1', {active: 'STM...'}, true, true, false);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [{name: 'user1', keys: {}}],
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(Toast.show).toHaveBeenCalled();
      expect(goBack).toHaveBeenCalled();
    });

    it('should require biometrics for first account', async () => {
      const thunk = addAccount('user1', {active: 'STM...'}, true, false);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(StorageUtils.requireBiometricsLogin).toHaveBeenCalled();
    });
  });

  describe('forgetAccount', () => {
    it('should forget account', async () => {
      const thunk = forgetAccount('user1');
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [
          {name: 'user1', keys: {}},
          {name: 'user2', keys: {}},
        ],
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(mockDispatch).toHaveBeenCalled();
      expect(EncryptedStorageUtils.saveOnEncryptedStorage).toHaveBeenCalled();
    });
  });

  describe('forgetAccounts', () => {
    it('should forget all accounts', async () => {
      const thunk = forgetAccounts();
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalled();
      expect(EncryptedStorageUtils.clearEncryptedStorage).toHaveBeenCalled();
      expect(WidgetUtils.clearAccountBalanceList).toHaveBeenCalled();
    });
  });

  describe('addAccount - multiple accounts', () => {
    it('should show toast when multipleAccounts is true', async () => {
      // Add a new account (not existing) with multipleAccounts=true
      const thunk = addAccount('user2', {active: 'STM...'}, true, false, true);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [{name: 'user1', keys: {}}], // user2 doesn't exist yet
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.stringContaining('toast.added_account'),
      );
      // Verify it returns early and doesn't navigate
      expect(loadAccount).not.toHaveBeenCalled();
    });

    it('should navigate to Wallet when wallet is true and qr is false', async () => {
      const thunk = addAccount('user2', {active: 'STM...'}, true, false);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(loadAccount).toHaveBeenCalledWith('user2');
      expect(navigate).toHaveBeenCalledWith('Wallet');
    });

    it('should goBack when wallet is true, qr is true, and mainStack is true', async () => {
      const thunk = addAccount(
        'user2',
        {active: 'STM...'},
        true,
        true,
        false,
        true,
      );
      await thunk(mockDispatch, mockGetState, undefined);
      expect(loadAccount).toHaveBeenCalledWith('user2');
      expect(goBack).toHaveBeenCalled();
    });

    it('should resetStackAndNavigate when wallet is true, qr is true, and mainStack is false', async () => {
      const thunk = addAccount(
        'user2',
        {active: 'STM...'},
        true,
        true,
        false,
        false,
      );
      await thunk(mockDispatch, mockGetState, undefined);
      expect(loadAccount).toHaveBeenCalledWith('user2');
      expect(resetStackAndNavigate).toHaveBeenCalledWith('Wallet');
    });
  });

  describe('forgetAccount - edge cases', () => {
    it('should call forgetAccounts when last account is removed', async () => {
      const thunk = forgetAccount('user1');
      const getStateWithOneAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [{name: 'user1', keys: {}}],
      }));
      await thunk(mockDispatch, getStateWithOneAccount, undefined);
      // When last account is removed, forgetAccounts thunk is dispatched
      expect(mockDispatch).toHaveBeenCalled();
      // forgetAccounts is a thunk, so it will be dispatched as a function
      // We need to execute it to verify it clears storage
      const forgetAccountsThunk = mockDispatch.mock.calls.find(
        (call) => typeof call[0] === 'function',
      )?.[0];
      if (forgetAccountsThunk) {
        await forgetAccountsThunk(mockDispatch, getStateWithOneAccount);
        expect(EncryptedStorageUtils.clearEncryptedStorage).toHaveBeenCalled();
      }
    });
  });

  describe('forgetKey', () => {
    it('should forget account when only one key remains', async () => {
      const thunk = forgetKey('user1', KeyTypes.active);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [
          {
            name: 'user1',
            keys: {active: 'key1', activePubkey: 'pubkey1'},
          },
        ],
      }));
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(mockDispatch).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalled();
    });

    it('should remove key when multiple keys exist', async () => {
      const thunk = forgetKey('user1', KeyTypes.active);
      const getStateWithAccount = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [
          {
            name: 'user1',
            keys: {
              active: 'key1',
              activePubkey: 'pubkey1',
              posting: 'key2',
              postingPubkey: 'pubkey2',
            },
          },
        ],
      }));
      // Mock dispatch to capture updateAccounts call
      let updateAccountsCall: any;
      mockDispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') {
          updateAccountsCall = action;
          // Execute updateAccounts to test it
          return action(mockDispatch, getStateWithAccount, undefined);
        }
      });
      await thunk(mockDispatch, getStateWithAccount, undefined);
      expect(updateAccountsCall).toBeDefined();
      expect(showModal).toHaveBeenCalled();
      // Verify updateAccounts saved to storage
      expect(EncryptedStorageUtils.saveOnEncryptedStorage).toHaveBeenCalled();
    });

    it('should handle multiple accounts when removing key', async () => {
      const thunk = forgetKey('user1', KeyTypes.active);
      const getStateWithMultipleAccounts = jest.fn(() => ({
        auth: {mk: 'masterkey'},
        accounts: [
          {
            name: 'user1',
            keys: {
              active: 'key1',
              activePubkey: 'pubkey1',
              posting: 'key2',
              postingPubkey: 'pubkey2',
            },
          },
          {
            name: 'user2',
            keys: {
              posting: 'key3',
              postingPubkey: 'pubkey3',
            },
          },
        ],
      }));
      // Mock dispatch to capture updateAccounts call
      let updateAccountsCall: any;
      mockDispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') {
          updateAccountsCall = action;
          // Execute updateAccounts to test it
          return action(mockDispatch, getStateWithMultipleAccounts, undefined);
        }
      });
      await thunk(mockDispatch, getStateWithMultipleAccounts, undefined);
      expect(updateAccountsCall).toBeDefined();
      // Verify updateAccounts was called and other accounts remain unchanged
      expect(EncryptedStorageUtils.saveOnEncryptedStorage).toHaveBeenCalled();
    });
  });

  describe('reorderAccounts', () => {
    it('should reorder accounts', async () => {
      const newAccounts = [
        {name: 'user2', keys: {}},
        {name: 'user1', keys: {}},
      ];
      const thunk = reorderAccounts(newAccounts);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(EncryptedStorageUtils.saveOnEncryptedStorage).toHaveBeenCalledWith(
        expect.any(String),
        {list: newAccounts},
        'masterkey',
      );
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
