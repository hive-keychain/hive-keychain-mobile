import AsyncStorage from '@react-native-community/async-storage';
import {WidgetAccountBalanceToShow} from 'components/popups/widget-configuration/WidgetConfiguration';
import {NativeModules} from 'react-native';
import {
  WidgetAsyncStorageItem,
  WidgetSharedDataCommand,
} from 'src/enums/widgets.enum';

const SharedStorage = NativeModules.SharedStorage;

export type WidgetToUpdate =
  | 'account_balance_list'
  | 'all_widgets'
  | 'currency_list';

/**
 * Note: To facilitate accounts to show in widget, functions has been added into the account store actions. Specifically in: src/actions/accounts.ts
 */
const sendWidgetData = async (toUpdateWidget: WidgetToUpdate) => {
  try {
    const accountsToShow = await AsyncStorage.getItem('account_balance_list');

    if (accountsToShow) {
      const data = JSON.stringify({
        account_balance_list: accountsToShow,
      });

      SharedStorage.setData(data);
      SharedStorage.setCommand(
        WidgetSharedDataCommand.UPDATE_WIDGETS,
        toUpdateWidget,
      );
    }

    // IOS //TODO
    // await SharedGroupPreferences.setItem('widgetKey', {text: value}, group);
  } catch (error) {
    console.log('Error sending widget data: ', {error});
    console.log('Error message: ', {msg: error.message});
  }
};

const addAccountBalanceList = async (
  username: string,
  accountNames: string[],
) => {
  const accountsStoredToShow = await AsyncStorage.getItem(
    WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
  );
  if (accountsStoredToShow) {
    const parsedAccounts: WidgetAccountBalanceToShow[] = JSON.parse(
      accountsStoredToShow,
    );
    if (!parsedAccounts.find((acc) => acc.name === username)) {
      parsedAccounts.push({name: username, show: false});
      await AsyncStorage.setItem(
        WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
        JSON.stringify(parsedAccounts),
      );
    }
  } else if (!accountsStoredToShow && accountNames.length > 1) {
    await scanAccountsAndSave(accountNames);
  } else {
    await AsyncStorage.setItem(
      WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
      JSON.stringify([{name: username, show: false}]),
    );
  }
};

const scanAccountsAndSave = async (accountNames: string[]) => {
  await AsyncStorage.setItem(
    WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
    JSON.stringify(
      accountNames.map((account) => {
        return {
          name: account,
          show: false,
        };
      }),
    ),
  );
};

const removeAccountBalanceList = async (username: string) => {
  const accountsStoredToShow = await AsyncStorage.getItem(
    WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
  );
  if (accountsStoredToShow) {
    const parsedAccounts: WidgetAccountBalanceToShow[] = JSON.parse(
      accountsStoredToShow,
    );
    if (parsedAccounts.find((acc) => acc.name === username)) {
      await AsyncStorage.setItem(
        WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
        JSON.stringify(parsedAccounts.filter((acc) => acc.name !== username)),
      );
    }
  }
};

const clearAccountBalanceList = async () => {
  await AsyncStorage.removeItem(WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST);
};

export const WidgetUtils = {
  sendWidgetData,
  addAccountBalanceList,
  removeAccountBalanceList,
  clearAccountBalanceList,
  scanAccountsAndSave,
};
