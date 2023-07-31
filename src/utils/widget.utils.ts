import {NativeModules} from 'react-native';
import {getPrices} from './price';

const SharedStorage = NativeModules.SharedStorage;
interface Prices {
  usd: string;
  usd_24h_change: string;
}

interface DataCurrency {
  [key: string]: Prices;
}

const sendWidgetData = async () => {
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
    const data = {
      currency_list: dataCurrencies,
      account_balance_list: {
        theghost1980: {
          hive: '10,000.00',
          hbd: '10,000.00',
          hive_power: '10,000.00',
          hive_savings: '10,000.00',
          hbd_savings: '10,000.00',
          account_value: '10.000,00',
        },
        pablo: {
          hive: '110,000.00',
          hbd: '110,000.00',
          hive_power: '110,000.00',
          hive_savings: '110,000.00',
          hbd_savings: '110,000.00',
          account_value: '110.000,00',
        },
        pedro: {
          hive: '1,000.00',
          hbd: '1,000.00',
          hive_power: '1,000.00',
          hive_savings: '1,000.00',
          hbd_savings: '1,000.00',
          account_value: '1.000,00',
        },
        juan: {
          hive: '9,000.00',
          hbd: '9,000.00',
          hive_power: '9,000.00',
          hive_savings: '9,000.00',
          hbd_savings: '9,000.00',
          account_value: '9.000,00',
        },
      },
    };
    SharedStorage.set(JSON.stringify(data));
    // IOS //TODO
    // await SharedGroupPreferences.setItem('widgetKey', {text: value}, group);
  } catch (error) {
    console.log('Error sending widget data: ', {error});
    console.log('Error message: ', {msg: error.message});
    if (error && error.message) {
      if (error.message === 'Network Error') {
        const dataError: DataCurrency = {};
        dataError['error'] = {
          usd: 'Please active internet!',
          usd_24h_change: '0.0',
        };
        SharedStorage.set(JSON.stringify(dataCurrencies));
      }
    }
  }
};

export const WidgetUtils = {sendWidgetData};
