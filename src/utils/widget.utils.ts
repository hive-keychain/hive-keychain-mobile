import AsyncStorage from '@react-native-community/async-storage';
import {WidgetAccountBalanceToShow} from 'components/popups/widget-configuration/widget-configuration';
import {NativeModules} from 'react-native';
import {
  WidgetAsyncStorageItem,
  WidgetSharedDataCommand,
} from 'src/enums/widgets.enum';

const SharedStorage = NativeModules.SharedStorage;
interface Prices {
  usd: string;
  usd_24h_change: string;
}

interface DataCurrency {
  [key: string]: Prices;
}

export type WidgetToUpdate =
  | 'account_balance_list'
  | 'all_widgets'
  | 'currency_list';

const sendWidgetData = async (toUpdateWidget: WidgetToUpdate) => {
  //TODO bellow cleanup
  //For now currencies not being invoked. Leaved if needed for future.
  //currencies
  // const dataCurrencies: DataCurrency = {};
  try {
    // const prices = await getPrices();
    // if (prices && prices.hive && prices.hive_dollar) {
    //   //Remove specific keys from price object to omit rendering in widget native.
    //   delete prices.bitcoin;
    //   Object.entries(prices).forEach(([key, data]) => {
    //     const usd = Number((data as any).usd).toFixed(3);
    //     const usd_24h_change = Number((data as any).usd_24h_change).toFixed(2);
    //     dataCurrencies[key] = {
    //       usd: usd,
    //       usd_24h_change: usd_24h_change,
    //     };
    //   });
    // } else throw new Error('Hive data not present, please check!');

    //accounts to widget
    const accountsToShow = await AsyncStorage.getItem('account_balance_list');
    // let dataAccounts: {[key: string]: any} = {};
    if (accountsToShow) {
      const data = JSON.stringify({
        // currency_list: dataCurrencies,
        account_balance_list: accountsToShow,
      });
      console.log({aboutToSend: data});
      SharedStorage.setData(data);
      SharedStorage.setCommand(
        WidgetSharedDataCommand.UPDATE_WIDGETS,
        toUpdateWidget,
      );
      // const finalAccountsToShow: WidgetAccountBalanceToShow[] = JSON.parse(
      //   accountsToShow,
      // ).filter((acc: any) => acc.show);
      // for (let i = 0; i < finalAccountsToShow.length; i++) {
      //   const account = finalAccountsToShow[i];
      //   const extendedAccount = (
      //     await AccountUtils.getAccount(account.name)
      //   )[0];
      //   dataAccounts[`${account.name}`] = {
      //     hive: withCommas(extendedAccount.balance as string, 2),
      //     hbd: withCommas(extendedAccount.hbd_balance as string, 2),
      //     hive_power: withCommas(
      //       toHP(
      //         extendedAccount.vesting_shares as string,
      //         (store.getState() as RootState).properties.globals,
      //       ).toString(),
      //       2,
      //     ),
      //     hive_savings: withCommas(
      //       extendedAccount.savings_balance as string,
      //       2,
      //     ),
      //     hbd_savings: withCommas(
      //       extendedAccount.savings_hbd_balance as string,
      //       2,
      //     ),
      //     account_value: withCommas(
      //       getAccountValue(
      //         extendedAccount,
      //         prices,
      //         (store.getState() as RootState).properties.globals,
      //       ) as string,
      //       2,
      //     ),
      //   };
      // }
    }
    // const data = {
    //   // currency_list: dataCurrencies,
    //   account_balance_list: dataAccounts,
    // };
    // console.log({aboutToSend: data}); //TODO remove
    // SharedStorage.setData(JSON.stringify(data));
    // SharedStorage.setCommand(
    //   WidgetSharedDataCommand.UPDATE_WIDGETS,
    //   toUpdateWidget,
    // );

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
  //TODO
  //  - what about when updating the app?
  //    - this case may be: no accountsStoredToShow but yes accounts > 1.
  //    - so it should scan and add all present accounts.
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
    //we must scan & save.
    console.log('Found more accounts, stored!');
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
