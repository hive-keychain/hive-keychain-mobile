import {getCurrency, isTestnet, setRpc} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testRpcObject from '__tests__/utils-for-testing/data/test-rpc-object';
import {BaseCurrencyTests} from '__tests__/utils-for-testing/interface/currencies-tests';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/getCurrency cases:\n', () => {
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

  it('Must return currency on each case with testnet as false', async () => {
    casesTestnetFalse.forEach((data) => {
      const {baseCurrency, currency} = data;
      expect(getCurrency(baseCurrency)).toBe(currency);
    });
  });

  it('Must return currency for each case while on testnet', async () => {
    await setRpc(testRpcObject.testMan);
    expect(isTestnet()).toBe(true);
    casesTestnet.forEach((data) => {
      const {baseCurrency, currency} = data;
      expect(getCurrency(baseCurrency)).toBe(currency);
    });
  });
});
