import {broadcast} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testOperation from '__tests__/utils-for-testing/data/test-operation';
import method from '__tests__/utils-for-testing/helpers/method';
import hiveTxMocks from '__tests__/utils-for-testing/mocks/hive-tx/hive-tx-mocks';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/common broadcast cases:\n', () => {
  const {sucess: successResponse, error: errorResponse} = testBroadcastResponse;
  const {active: activeKey} = testAccount._default.keys;
  beforeEach(() => {
    hiveTxMocks.tx.create();
    hiveTxMocks.tx.sign();
  });
  afterEach(() => {
    method.clearSpies([consoleSpy.log]);
  });
  it('Must throw error if error on broadcast', async () => {
    hiveTxMocks.tx.broadcast(errorResponse('Error on Broadcast'));
    const operationsArr = testOperation.filter((op) => op[0] === 'transfer');
    try {
      await broadcast(activeKey, operationsArr);
    } catch (error) {
      expect(consoleSpy.log).toBeCalledTimes(2);
    }
  });

  it('Must throw error if broadcast is rejected', async () => {
    const rejectionError = new Error('Rejected Promise!');
    hiveTxMocks.tx.broadcast(
      errorResponse('Error on Broadcast'),
      rejectionError,
    );
    const operationsArr = testOperation.filter((op) => op[0] === 'transfer');
    try {
      await broadcast(activeKey, operationsArr);
    } catch (error) {
      expect(consoleSpy.log).toBeCalledTimes(1);
      expect(error).toEqual(rejectionError);
    }
  });

  it('Must broadcast operation(s)', async () => {
    hiveTxMocks.tx.broadcast(successResponse);
    const operationsArr = testOperation.filter((op) => op[0] === 'transfer');
    expect(await broadcast(activeKey, operationsArr)).toEqual(
      successResponse.result,
    );
  });
});
