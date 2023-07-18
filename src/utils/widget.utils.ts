import {NativeModules} from 'react-native';
import {getPrices} from './price';

const SharedStorage = NativeModules.SharedStorage;
// const group = 'group.streak';

interface Prices {
  usd: string;
  usd_24h_change: string;
}

const sendWidgetData = async () => {
  const dataCurrencies: {[key: string]: Prices} = {};
  try {
    const prices = await getPrices();
    if (prices && prices.hive && prices.hive_dollar) {
      console.log({prices}); //TODO remove line
      Object.entries(prices).forEach(([key, data]) => {
        console.log({key, data});
        const usd = Number((data as any).usd).toFixed(3);
        const usd_24h_change = Number((data as any).usd_24h_change).toFixed(2);
        dataCurrencies[key] = {
          usd: usd,
          usd_24h_change: usd_24h_change,
        };
      });
      console.log({str: JSON.stringify(dataCurrencies)}); //TODO remove line
    } else throw new Error('Hive data not present, please check!');
    SharedStorage.set(JSON.stringify(dataCurrencies));

    // IOS TODO
    // await SharedGroupPreferences.setItem('widgetKey', {text: value}, group);
  } catch (error) {
    console.log('Error sending widget data: ', {error});
  }
};

export const WidgetUtils = {sendWidgetData};
