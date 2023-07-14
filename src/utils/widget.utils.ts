import {NativeModules} from 'react-native';
import {getPrices} from './price';

const SharedStorage = NativeModules.SharedStorage;
// const group = 'group.streak';

const sendWidgetData = async () => {
  let data = {
    HIVE: 'Loading...HIVE',
    HBD: 'Loading...HBD',
  };
  try {
    const prices = await getPrices();
    if (prices && prices.hive && prices.hive_dollar) {
      // Android send shared data
      data['HIVE'] = `HIVE ${Number(prices.hive.usd).toFixed(
        3,
      )}$ / 24h: ${Number(prices.hive.usd_24h_change).toFixed(2)}%`;
      data['HBD'] = `HBD ${Number(prices.hive_dollar.usd).toFixed(
        3,
      )}$ / 24h: ${Number(prices.hive_dollar.usd_24h_change).toFixed(2)}%`;
    }
    SharedStorage.set(JSON.stringify(data));

    // IOS TODO
    // await SharedGroupPreferences.setItem('widgetKey', {text: value}, group);
  } catch (error) {
    console.log('Error sending widget data: ', {error});
  }
};

export const WidgetUtils = {sendWidgetData};
