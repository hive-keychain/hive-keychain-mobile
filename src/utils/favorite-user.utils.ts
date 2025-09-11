import AsyncStorage from '@react-native-async-storage/async-storage';
import {Account, ActiveAccount} from 'actions/interfaces';
import {ExchangesUtils} from 'hive-keychain-commons';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {
  AutoCompleteCategory,
  AutoCompleteValue,
  AutoCompleteValues,
} from 'src/interfaces/autocomplete.interface';
import {
  FavoriteUserItems,
  FavoriteUserListName,
} from 'src/interfaces/favoriteUsers.interface';
import {RootState, store} from 'store';

export interface AutocompleteListOption {
  addExchanges?: boolean;
  addSwaps?: boolean;
  token?: string;
}

const exchanges = ExchangesUtils.getExchanges();

const getAutocompleteList = async (
  username: string,
  localAccounts: Account[],
  options?: AutocompleteListOption,
): Promise<AutoCompleteValue[]> => {
  const favoriteUsers: FavoriteUserItems = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.FAVORITE_USERS),
  );
  const autoCompleteList: AutoCompleteValue[] = [];
  if (favoriteUsers && favoriteUsers[username]) {
    for (const fav of favoriteUsers[username]) {
      if (
        !exchanges.find((exchange) => exchange.username === fav) &&
        !localAccounts.find((localAccount) => localAccount.name === fav)
      )
        autoCompleteList.push({value: fav});
    }
  }
  for (const localAccount of localAccounts) {
    if (localAccount.name !== username) {
      autoCompleteList.push({
        value: localAccount.name,
      });
    }
  }
  if (options?.addExchanges)
    for (const exchange of exchanges) {
      if (
        ((options?.token && exchange.acceptedCoins.includes(options.token)) ||
          !options?.token) &&
        exchange.username.length > 0
      )
        autoCompleteList.push({
          value: exchange.username,
          subLabel: exchange.name,
        });
    }
  return autoCompleteList;
};

const saveFavoriteUser = async (
  username: string,
  activeAccount: ActiveAccount,
  // localAccounts: Account[],
) => {
  // const mk =  store.getState().auth.mk;
  const localAccounts = (store.getState() as RootState).accounts;
  let favoriteUser = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.FAVORITE_USERS),
  );
  if (!favoriteUser) {
    favoriteUser = {[activeAccount.name!]: []};
  }
  if (!favoriteUser[activeAccount.name!]) {
    favoriteUser[activeAccount.name!] = [];
  }

  let found = false;
  if (favoriteUser[activeAccount.name!].length > 0) {
    found = Object.values(favoriteUser[activeAccount.name!]).some(
      (favValue: any) => favValue.value === username,
    );
  }

  if (
    !found &&
    !exchanges.find((exchange) => exchange.username === username) &&
    !localAccounts.find((localAccount) => localAccount.name === username)
  ) {
    favoriteUser[activeAccount.name!].push({
      value: username,
      subLabel: '',
    } as AutoCompleteValue);
  }
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.FAVORITE_USERS,
    JSON.stringify(favoriteUser),
  );
};

const getAutocompleteListByCategories = async (
  username: string,
  localAccounts: Account[],
  options?: AutocompleteListOption,
): Promise<AutoCompleteValues> => {
  const favoriteUsers: {
    [key: string]: any[];
  } = await fixFavoriteList(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.FAVORITE_USERS),
  );
  const favoriteUsersList: AutoCompleteCategory = {
    title: FavoriteUserListName.USERS,
    translateTitle: true,
    values: [],
  };
  const favoriteLocalAccountsList: AutoCompleteCategory = {
    title: FavoriteUserListName.LOCAL_ACCOUNTS,
    translateTitle: true,
    values: [],
  };
  const favoriteExchangesList: AutoCompleteCategory = {
    title: FavoriteUserListName.EXCHANGES,
    translateTitle: true,
    values: [],
  };
  const favoriteUsersCompleteList: AutoCompleteValues = {
    categories: [],
  };

  if (favoriteUsers && favoriteUsers[username]) {
    for (const fav of favoriteUsers[username]) {
      if (
        !exchanges.find((exchange) => exchange.username === fav) &&
        !localAccounts.find((localAccount) => localAccount.name === fav)
      )
        favoriteUsersList.values.push(fav);
    }
  }

  for (const localAccount of localAccounts) {
    if (localAccount.name !== username) {
      favoriteLocalAccountsList.values.push({
        value: localAccount.name,
        subLabel: '',
      });
    }
  }
  if (options?.addExchanges)
    for (const exchange of exchanges) {
      if (
        ((options?.token && exchange.acceptedCoins.includes(options.token)) ||
          !options?.token) &&
        exchange.username.length > 0
      )
        favoriteExchangesList.values.push({
          value: exchange.username,
          subLabel: exchange.name,
        });
    }
  if (favoriteUsersList.values.length > 0) {
    favoriteUsersCompleteList.categories.push(favoriteUsersList);
  }
  if (favoriteLocalAccountsList.values.length > 0) {
    favoriteUsersCompleteList.categories.push(favoriteLocalAccountsList);
  }
  if (favoriteExchangesList.values.length > 0) {
    favoriteUsersCompleteList.categories.push(favoriteExchangesList);
  }
  return favoriteUsersCompleteList;
};

const fixFavoriteList = async (favoriteUsers: any) => {
  let hasChanged = false;
  if (typeof favoriteUsers === 'string') {
    favoriteUsers = JSON.parse(favoriteUsers);
  }
  for (const user in favoriteUsers) {
    if (!Array.isArray(favoriteUsers[user])) favoriteUsers[user] = [];
    favoriteUsers[user] = favoriteUsers[user].map((e: any) => {
      if (typeof e === 'string') {
        hasChanged = true;
        return {label: e, value: e};
      } else return e;
    });
  }
  if (hasChanged) {
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.FAVORITE_USERS,
      JSON.stringify(favoriteUsers),
    );
  }
  return favoriteUsers;
};

export const FavoriteUserUtils = {
  getAutocompleteList,
  saveFavoriteUser,
  getAutocompleteListByCategories,
  fixFavoriteList,
};
