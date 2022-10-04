import {BaseCurrencyTests} from '__tests__/utils-for-testing/interface/currencies-tests';

const casesTestnetFalse: BaseCurrencyTests[] = [
  {baseCurrency: 'HIVE', currency: 'HIVE'},
  {baseCurrency: 'HBD', currency: 'HBD'},
  {baseCurrency: 'HP', currency: 'HP'},
];

const casesTestnet: BaseCurrencyTests[] = [
  {baseCurrency: 'HIVE', currency: 'TESTS'},
  {baseCurrency: 'HBD', currency: 'TBD'},
  {baseCurrency: 'HP', currency: 'TP'},
];

export default {casesTestnetFalse, casesTestnet};
