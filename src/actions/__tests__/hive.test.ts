jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
      activeAccount: {name: 'user1'},
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(),
  getData: jest.fn(),
}));

jest.mock('utils/price.utils', () => ({
  getPrices: jest.fn(),
}));

jest.mock('utils/hive.utils', () => ({
  getDelegatees: jest.fn(),
  getDelegators: jest.fn(),
  getConversionRequests: jest.fn(),
  getSavingsRequests: jest.fn(),
}));

jest.mock('utils/transfer.utils', () => ({
  TransferUtils: {
    getRecurrentTransfers: jest.fn(),
  },
}));

jest.mock('utils/phishing.utils', () => ({
  __esModule: true,
  default: {
    getPhishingAccounts: jest.fn(),
  },
}));

jest.mock('utils/account.utils', () => ({
  __esModule: true,
  default: {
    getRCMana: jest.fn(),
  },
}));

jest.mock('utils/transactions.utils', () => ({
  __esModule: true,
  default: {
    getAccountTransactions: jest.fn(),
  },
}));

jest.mock('../hiveEngine', () => ({
  loadUserTokens: jest.fn(() => ({type: 'LOAD_USER_TOKENS'})),
}));

import AccountUtils from 'utils/account.utils';
import {
  getConversionRequests,
  getDelegatees,
  getDelegators,
  getSavingsRequests,
} from 'utils/hive.utils';
import {getClient} from 'utils/hiveLibs.utils';
import PhishingUtils from 'utils/phishing.utils';
import {getPrices} from 'utils/price.utils';
import TransactionUtils from 'utils/transactions.utils';
import {TransferUtils} from 'utils/transfer.utils';
import {
  clearUserTransactions,
  fetchAccountTransactions,
  fetchConversionRequests,
  fetchPhishingAccounts,
  fetchRecurrentTransfers,
  fetchSavingsRequests,
  initAccountTransactions,
  loadAccount,
  loadDelegatees,
  loadDelegators,
  loadPrices,
  loadProperties,
} from '../hive';
import {loadUserTokens} from '../hiveEngine';

describe('hive actions', () => {
  let mockDispatch: jest.Mock;
  const mockGetState = jest.fn(() => ({
    accounts: [{name: 'user1', keys: {memo: 'STM...'}}],
    properties: {globals: {}},
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
  });

  describe('loadAccount', () => {
    it('should load account and dispatch actions with initTransactions', async () => {
      const mockAccount = {name: 'user1'};
      (getClient as jest.Mock).mockReturnValue({
        database: {
          getAccounts: jest.fn().mockResolvedValue([mockAccount]),
        },
      });
      (AccountUtils.getRCMana as jest.Mock).mockResolvedValueOnce(100);
      (
        TransactionUtils.getAccountTransactions as jest.Mock
      ).mockResolvedValueOnce([]);
      // Mock dispatch to execute thunks
      mockDispatch.mockImplementation(async (action: any) => {
        if (typeof action === 'function') {
          await action(mockDispatch, mockGetState, undefined);
        }
      });
      const thunk = loadAccount('user1', true);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalled();
      expect(loadUserTokens).toHaveBeenCalledWith('user1');
      // getAccountRC is called internally via dispatch, verify it was called
      expect(AccountUtils.getRCMana).toHaveBeenCalledWith('user1');
    });

    it('should load account without initTransactions', async () => {
      const mockAccount = {name: 'user1'};
      (getClient as jest.Mock).mockReturnValue({
        database: {
          getAccounts: jest.fn().mockResolvedValue([mockAccount]),
        },
      });
      (AccountUtils.getRCMana as jest.Mock).mockResolvedValueOnce(100);
      const thunk = loadAccount('user1', false);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalled();
      expect(loadUserTokens).toHaveBeenCalledWith('user1');
    });

    it('should handle getAccountRC error gracefully', async () => {
      const mockAccount = {name: 'user1'};
      (getClient as jest.Mock).mockReturnValue({
        database: {
          getAccounts: jest.fn().mockResolvedValue([mockAccount]),
        },
      });
      (AccountUtils.getRCMana as jest.Mock).mockRejectedValueOnce(
        new Error('RC error'),
      );
      const thunk = loadAccount('user1', false);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('loadDelegators', () => {
    it('should load delegators', async () => {
      (getDelegators as jest.Mock).mockResolvedValueOnce([]);
      const thunk = loadDelegators('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_DELEGATORS',
        payload: {incoming: []},
      });
    });

    it('should handle error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = new Error('Delegators error');
      (getDelegators as jest.Mock).mockRejectedValueOnce(error);
      const thunk = loadDelegators('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(consoleSpy).toHaveBeenCalledWith(error);
      consoleSpy.mockRestore();
    });
  });

  describe('loadDelegatees', () => {
    it('should load delegatees', async () => {
      (getDelegatees as jest.Mock).mockResolvedValueOnce([]);
      const thunk = loadDelegatees('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_DELEGATEES',
        payload: {outgoing: []},
      });
    });

    it('should handle error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = new Error('Delegatees error');
      (getDelegatees as jest.Mock).mockRejectedValueOnce(error);
      const thunk = loadDelegatees('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(consoleSpy).toHaveBeenCalledWith(error);
      consoleSpy.mockRestore();
    });
  });

  describe('fetchConversionRequests', () => {
    it('should load conversion requests without filter', async () => {
      (getConversionRequests as jest.Mock).mockResolvedValueOnce([]);
      const thunk = fetchConversionRequests('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(getConversionRequests).toHaveBeenCalledWith('user1', undefined);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_CONVERSION_REQUESTS',
        payload: [],
      });
    });

    it('should load conversion requests with HBD filter', async () => {
      (getConversionRequests as jest.Mock).mockResolvedValueOnce([]);
      const thunk = fetchConversionRequests('user1', 'HBD');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(getConversionRequests).toHaveBeenCalledWith('user1', 'HBD');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_CONVERSION_REQUESTS',
        payload: [],
      });
    });

    it('should load conversion requests with HIVE filter', async () => {
      (getConversionRequests as jest.Mock).mockResolvedValueOnce([]);
      const thunk = fetchConversionRequests('user1', 'HIVE');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(getConversionRequests).toHaveBeenCalledWith('user1', 'HIVE');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_CONVERSION_REQUESTS',
        payload: [],
      });
    });
  });

  describe('fetchPhishingAccounts', () => {
    it('should fetch phishing accounts', async () => {
      const mockPhishingAccounts = ['phishing1', 'phishing2'];
      (PhishingUtils.getPhishingAccounts as jest.Mock).mockResolvedValueOnce(
        mockPhishingAccounts,
      );
      const thunk = fetchPhishingAccounts();
      await thunk(mockDispatch, mockGetState, undefined);
      expect(PhishingUtils.getPhishingAccounts).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_PHISHING_ACCOUNTS',
        payload: mockPhishingAccounts,
      });
    });
  });

  describe('fetchRecurrentTransfers', () => {
    it('should fetch recurrent transfers and sort them', async () => {
      const mockTransfers = {
        recurrent_transfers: [
          {to: 'user2', pair_id: 2},
          {to: 'user1', pair_id: 1},
          {to: 'user1', pair_id: 2},
        ],
      };
      (TransferUtils.getRecurrentTransfers as jest.Mock).mockResolvedValueOnce(
        mockTransfers,
      );
      const thunk = fetchRecurrentTransfers('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(TransferUtils.getRecurrentTransfers).toHaveBeenCalledWith('user1');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_RECURRENT_TRANSFERS',
        payload: [
          {to: 'user1', pair_id: 1},
          {to: 'user1', pair_id: 2},
          {to: 'user2', pair_id: 2},
        ],
      });
    });
  });

  describe('fetchSavingsRequests', () => {
    it('should fetch savings requests', async () => {
      const mockSavings = [{id: '1', amount: '100'}];
      (getSavingsRequests as jest.Mock).mockResolvedValueOnce(mockSavings);
      const thunk = fetchSavingsRequests('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(getSavingsRequests).toHaveBeenCalledWith('user1');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'FETCH_SAVINGS_REQUESTS',
        payload: mockSavings,
      });
    });
  });

  describe('loadPrices', () => {
    it('should load currency prices', async () => {
      (getPrices as jest.Mock).mockResolvedValueOnce({});
      const thunk = loadPrices();
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'GET_CURRENCY_PRICES',
        payload: {},
      });
    });

    it('should handle price error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = new Error('Price error');
      (getPrices as jest.Mock).mockRejectedValueOnce(error);
      const thunk = loadPrices();
      await thunk(mockDispatch, mockGetState, undefined);
      expect(consoleSpy).toHaveBeenCalledWith('price error', error);
      consoleSpy.mockRestore();
    });
  });

  describe('clearUserTransactions', () => {
    it('should dispatch CLEAR_USER_TRANSACTIONS action', async () => {
      const thunk = clearUserTransactions();
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CLEAR_USER_TRANSACTIONS',
      });
    });
  });

  describe('initAccountTransactions', () => {
    it('should initialize account transactions', async () => {
      const mockTransactions = [{id: '1', type: 'transfer'}];
      (
        TransactionUtils.getAccountTransactions as jest.Mock
      ).mockResolvedValueOnce(mockTransactions);
      const thunk = initAccountTransactions('user1');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(TransactionUtils.getAccountTransactions).toHaveBeenCalledWith(
        'user1',
        null,
        {},
        'STM...',
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'INIT_TRANSACTIONS',
        }),
      );
    });
  });

  describe('fetchAccountTransactions', () => {
    it('should fetch account transactions with start parameter', async () => {
      const mockTransactions = [{id: '2', type: 'transfer'}];
      (
        TransactionUtils.getAccountTransactions as jest.Mock
      ).mockResolvedValueOnce(mockTransactions);
      const thunk = fetchAccountTransactions('user1', 100);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(TransactionUtils.getAccountTransactions).toHaveBeenCalledWith(
        'user1',
        100,
        {},
        'STM...',
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ADD_TRANSACTIONS',
        }),
      );
    });

    it('should not dispatch if transactions is null', async () => {
      (
        TransactionUtils.getAccountTransactions as jest.Mock
      ).mockResolvedValueOnce(null);
      const thunk = fetchAccountTransactions('user1', 100);
      await thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).not.toHaveBeenCalledWith({
        type: 'ADD_TRANSACTIONS',
        payload: null,
      });
    });
  });

  describe('loadProperties', () => {
    it('should load global properties', async () => {
      (getClient as jest.Mock).mockReturnValue({
        database: {
          getDynamicGlobalProperties: jest.fn().mockResolvedValue({}),
          getCurrentMedianHistoryPrice: jest.fn().mockResolvedValue({}),
          call: jest.fn().mockResolvedValue({}),
        },
      });
      const thunk = loadProperties();
      await thunk(mockDispatch, mockGetState);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
