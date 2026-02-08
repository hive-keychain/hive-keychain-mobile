jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [{name: 'user1'}],
    })),
  },
}));

import {FavoriteUserUtils} from '../favoriteUsers.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {Account, ActiveAccount} from 'actions/interfaces';
import {ExchangesUtils} from 'hive-keychain-commons';

jest.mock('hive-keychain-commons', () => ({
  ExchangesUtils: {
    getExchanges: jest.fn(() => [
      {username: 'exchange1', name: 'Exchange 1', acceptedCoins: ['HIVE']},
    ]),
  },
}));

describe('FavoriteUserUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAutocompleteList', () => {
    it('should return autocomplete list with favorite users', async () => {
      const mockFavoriteUsers = {
        user1: ['favorite1', 'favorite2'],
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockFavoriteUsers),
      );
      const localAccounts: Account[] = [
        {name: 'user1'} as Account,
        {name: 'user2'} as Account,
      ];
      const result = await FavoriteUserUtils.getAutocompleteList(
        'user1',
        localAccounts,
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((item) => item.value === 'favorite1')).toBe(true);
    });

    it('should include local accounts', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const localAccounts: Account[] = [
        {name: 'user1'} as Account,
        {name: 'user2'} as Account,
      ];
      const result = await FavoriteUserUtils.getAutocompleteList(
        'user1',
        localAccounts,
      );
      expect(result.some((item) => item.value === 'user2')).toBe(true);
    });

    it('should include exchanges when option enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const localAccounts: Account[] = [{name: 'user1'} as Account];
      const result = await FavoriteUserUtils.getAutocompleteList(
        'user1',
        localAccounts,
        {addExchanges: true},
      );
      expect(result.some((item) => item.value === 'exchange1')).toBe(true);
    });
  });

  describe('saveFavoriteUser', () => {
    it('should save favorite user', async () => {
      const {store} = require('store');
      store.getState = jest.fn(() => ({
        accounts: [{name: 'user1'} as Account],
      }));
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const activeAccount: ActiveAccount = {
        name: 'user1',
      } as ActiveAccount;
      await FavoriteUserUtils.saveFavoriteUser('favorite1', activeAccount);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('fixFavoriteList', () => {
    it('should convert string values to objects', async () => {
      const mockFavoriteUsers = {
        user1: ['favorite1', 'favorite2'],
      };
      const result = await FavoriteUserUtils.fixFavoriteList(
        JSON.stringify(mockFavoriteUsers),
      );
      expect(result.user1[0]).toHaveProperty('value');
      expect(result.user1[0]).toHaveProperty('label');
    });

    it('should save changes if list was updated', async () => {
      const mockFavoriteUsers = {
        user1: ['favorite1'],
      };
      await FavoriteUserUtils.fixFavoriteList(
        JSON.stringify(mockFavoriteUsers),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
