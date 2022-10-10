import {TokenMarket} from 'actions/interfaces';
import hsc from 'api/hiveEngine';
import {getHiveEngineTokenValue, tryConfirmTransaction} from 'utils/hiveEngine';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testTokenMarket from '__tests__/utils-for-testing/data/test-token-market';
import testTokenUser from '__tests__/utils-for-testing/data/test-token-user';
import testTrx from '__tests__/utils-for-testing/data/test-trx';
import objects from '__tests__/utils-for-testing/helpers/objects';
afterAllTest.clearAllMocks;
describe('hiveEngine tests:\n', () => {
  describe('tryConfirmTransaction cases', () => {
    const {id: trxID} = testTrx.ssc._default;
    it('Must confirm transaction with no errors', async () => {
      hsc.getTransactionInfo = jest.fn().mockResolvedValue({
        logs: JSON.stringify({}),
      });
      expect(await tryConfirmTransaction(trxID)).toEqual({
        confirmed: true,
        error: null,
      });
    });

    it('Must return error', async () => {
      hsc.getTransactionInfo = jest.fn().mockResolvedValue({
        logs: JSON.stringify({errors: ['errors']}),
      });
      expect(await tryConfirmTransaction(trxID)).toEqual({
        confirmed: true,
        error: 'errors',
      });
    });
  });

  describe('getHiveEngineTokenValue cases:\n', () => {
    const {balance, notInMarket} = testTokenUser;
    const {list: market} = testTokenMarket;
    it('Must return 0 if not found in token market list', () => {
      expect(getHiveEngineTokenValue(notInMarket, market)).toBe(0);
    });

    it('Must return token balace * 1, if not found and token is SWAP.HIVE', () => {
      const swapHiveToken = balance.filter(
        (token) => token.symbol === 'SWAP.HIVE',
      )[0];
      const cloneMarketWithoutSwapHive = objects.clone(market) as TokenMarket[];
      expect(
        getHiveEngineTokenValue(
          swapHiveToken,
          cloneMarketWithoutSwapHive.filter(
            (token) => token.symbol !== 'SWAP.HIVE',
          ),
        ),
      ).toBe(parseFloat(swapHiveToken.balance));
    });

    it('Must return token balance * price', () => {
      const leoToken = balance.filter((token) => token.symbol === 'LEO')[0];
      expect(getHiveEngineTokenValue(leoToken, market)).toBe(6606.37);
    });
  });
});
