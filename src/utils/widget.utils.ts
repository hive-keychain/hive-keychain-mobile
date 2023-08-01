import AsyncStorage from '@react-native-community/async-storage';
import {NativeModules} from 'react-native';
import {store} from 'store';
import AccountUtils from './account.utils';
import {toHP, withCommas} from './format';
import {getAccountValue, getPrices} from './price';

const SharedStorage = NativeModules.SharedStorage;
interface Prices {
  usd: string;
  usd_24h_change: string;
}

interface DataCurrency {
  [key: string]: Prices;
}

const sendWidgetData = async () => {
  const accounts = store.getState().accounts;
  console.log({accounts});

  //currencies
  const dataCurrencies: DataCurrency = {};
  try {
    const prices = await getPrices();
    if (prices && prices.hive && prices.hive_dollar) {
      //Remove specific keys from price object to omit rendering in widget native.
      delete prices.bitcoin;
      Object.entries(prices).forEach(([key, data]) => {
        const usd = Number((data as any).usd).toFixed(3);
        const usd_24h_change = Number((data as any).usd_24h_change).toFixed(2);
        dataCurrencies[key] = {
          usd: usd,
          usd_24h_change: usd_24h_change,
        };
      });
    } else throw new Error('Hive data not present, please check!');

    //accounts to show in widget
    ///////////////////////
    //TODO get value from async storage.
    const accountsToShow = await AsyncStorage.getItem('account_balance_list');
    //what //TODO if not set any account yet?
    let dataAccounts: {[key: string]: any} = {};
    if (accountsToShow) {
      //TODO organize types & interfaces needed.
      const finalAccountsToShow = JSON.parse(accountsToShow).filter(
        (acc: any) => acc.show,
      );
      for (let i = 0; i < finalAccountsToShow.length; i++) {
        const account = finalAccountsToShow[i];
        const extendedAccount = (
          await AccountUtils.getAccount(account.name)
        )[0];
        //TODO need to format data?? check
        dataAccounts[`${account.name}`] = {
          hive: withCommas(extendedAccount.balance as string, 2),
          hbd: withCommas(extendedAccount.hbd_balance as string, 2),
          hive_power: withCommas(
            toHP(
              extendedAccount.vesting_shares as string,
              store.getState().globals,
            ).toString(),
            2,
          ),
          hive_savings: withCommas(
            extendedAccount.savings_balance as string,
            2,
          ),
          hbd_savings: withCommas(
            extendedAccount.savings_hbd_balance as string,
            2,
          ),
          account_value: getAccountValue(
            extendedAccount,
            prices,
            store.getState().globals,
          ),
        };
      }
    }
    ///////////////////////////

    const data = {
      currency_list: dataCurrencies,
      account_balance_list: dataAccounts,
    };
    console.log({data}); //TODO remove line
    SharedStorage.set(JSON.stringify(data));
    // IOS //TODO
    // await SharedGroupPreferences.setItem('widgetKey', {text: value}, group);
  } catch (error) {
    console.log('Error sending widget data: ', {error});
    console.log('Error message: ', {msg: error.message});
  }
};

export const WidgetUtils = {sendWidgetData};
