import hsc from 'api/hiveEngine';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testTrx from '__tests__/utils-for-testing/data/test-trx';
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
    it.todo('Will be a great TODO test!'); //TODO monday
  });
});
