import {translate} from 'utils/localize';
import {getTransferWarning} from 'utils/transferValidator';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testPhishing from '__tests__/utils-for-testing/data/test-phishing';
afterAllTest.clearAllMocks;
describe('transferValidator tests:\n', () => {
  describe('getExchangeValidationWarning cases:\n', () => {
    it('Must return warning about memo on orinoco if HIVE used', () => {
      expect(
        getTransferWarning(
          testPhishing.accounts.data,
          'orinoco',
          'HIVE',
          false,
        ),
      ).toEqual({
        exchange: false,
        warning: translate('wallet.operations.transfer.warning.exchange_memo'),
      });
    });

    it('Must return warning about memo on orinoco if HBD used', () => {
      expect(
        getTransferWarning(testPhishing.accounts.data, 'orinoco', 'HBD', false),
      ).toEqual({
        exchange: false,
        warning: translate('wallet.operations.transfer.warning.exchange_memo'),
      });
    });

    it('Must return warning about not existent coin on exchange', () => {
      expect(
        getTransferWarning(
          testPhishing.accounts.data,
          'orinoco',
          'SWAP.HIVE',
          true,
        ),
      ).toEqual({
        exchange: false,
        warning: translate(
          'wallet.operations.transfer.warning.exchange_currency',
          {
            currency: 'SWAP.HIVE',
          },
        ),
      });
    });

    it('Must return no warning if exchange used', () => {
      expect(getTransferWarning([], 'deepcrypto8', 'HIVE', true)).toEqual({
        exchange: true,
        warning: null,
      });
    });

    it('Must return phishing warning about account', () => {
      const phishingAccount = testPhishing.accounts.data[0];
      expect(
        getTransferWarning(
          testPhishing.accounts.data,
          phishingAccount,
          'HIVE',
          true,
        ),
      ).toEqual({
        exchange: false,
        warning: translate('wallet.operations.transfer.warning.phishing'),
      });
    });

    it('Must return null if exchange not found', () => {
      expect(getTransferWarning([], 'leodex', 'SWAP.HIVE', true)).toEqual({
        exchange: false,
        warning: null,
      });
    });
  });
});
