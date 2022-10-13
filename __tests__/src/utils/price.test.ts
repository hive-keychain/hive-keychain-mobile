import {Currency} from 'actions/interfaces';
import {getAccountValue} from 'utils/price';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testCurrencyPrices from '__tests__/utils-for-testing/data/test-currency-prices';
import testDynamicGlobalProperties from '__tests__/utils-for-testing/data/test-dynamic-global-properties';
afterAllTest.clearAllMocks;
describe('price tests:\n', () => {
  describe('getAccountValue cases:\n', () => {
    it('Must return account value', () => {
      expect(
        getAccountValue(
          testAccount.extended,
          testCurrencyPrices._default,
          testDynamicGlobalProperties,
        ),
      ).toBe('339549.403');
    });

    it('Must return 0 if no hive dollar price', () => {
      expect(
        getAccountValue(
          testAccount.extended,
          {...testCurrencyPrices._default, hive_dollar: {} as Currency},
          testDynamicGlobalProperties,
        ),
      ).toBe(0);
    });

    it('Must return 0 if no hive price', () => {
      expect(
        getAccountValue(
          testAccount.extended,
          {...testCurrencyPrices._default, hive: {} as Currency},
          testDynamicGlobalProperties,
        ),
      ).toBe(0);
    });
  });
});
