import {
  Client,
  Operation,
  OperationName,
  TransferOperation,
  VirtualOperationName,
} from '@hiveio/dhive';
import {getClient, getCurrency, isTestnet, setRpc, transfer} from 'utils/hive';
import * as HiveUtilsModule from 'utils/hive';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import getCurrencyArray from '__tests__/utils-for-testing/data/array-cases/success/get-currency-array';
import setRpcArray from '__tests__/utils-for-testing/data/array-cases/success/set-rpc-array';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testOperation from '__tests__/utils-for-testing/data/test-operation';
import testRpcObj from '__tests__/utils-for-testing/data/test-rpcObj';
import {BroadcastTestsSuccessResponse} from '__tests__/utils-for-testing/interface/broadcast-response';
import {BaseCurrencyTests} from '__tests__/utils-for-testing/interface/currencies-tests';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import method from '__tests__/utils-for-testing/helpers/method';
afterEachTest.clearAllMocks;
describe('hive tests:\n', () => {
  describe('setRpc cases:\n', () => {
    const {cases: RpcCases} = setRpcArray;
    it('Must pass each case', async () => {
      for (let i = 0; i < RpcCases.length; i++) {
        const {rpcObj, mocking, assertion} = RpcCases[i];
        mocking();
        expect(await setRpc(rpcObj)).toBeUndefined();
        assertion();
      }
    });
  });
  describe('isTestnet cases:\n', () => {
    it('Must return false', () => {
      expect(isTestnet()).toBe(false);
    });
  });
  describe('getCurrency cases:\n', () => {
    const {casesTestnet, casesTestnetFalse} = getCurrencyArray;
    it('Must return currency on each case', async () => {
      casesTestnetFalse.forEach((data) => {
        const {baseCurrency, currency} = data;
        expect(getCurrency(baseCurrency)).toBe(currency);
      });
      await setRpc(testRpcObj.testMan);
      expect(isTestnet()).toBe(true);
      casesTestnet.forEach((data) => {
        const {baseCurrency, currency} = data;
        expect(getCurrency(baseCurrency)).toBe(currency);
      });
    });
  });
  describe('getClient cases:\n', () => {
    it('Must return client', () => {
      expect(getClient()).toBeInstanceOf(Client);
    });
  });
  describe('broadcast operations cases:\n', () => {
    const {sucess: successResponse} = testBroadcastResponse;
    const {active} = testAccount._default.keys;
    it.skip('Must return success response on each case', async () => {
      //transfer recurrentTransfer powerUp  powerDown delegate convert
      //depositToSavings withdrawFromSavings vote  voteForWitness
      // setProxy createClaimedAccount
      hiveUtilsMocks.broadcast(successResponse);
      const op = method.getTestOperation('transfer') as TransferOperation[1];
      expect(await HiveUtilsModule['transfer'](active, op)).toBe(
        successResponse,
      );
      expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(active, [
        ['recurrent_transfer', op],
      ]);
      method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
    });
  });
});
