import {Client} from '@hiveio/dhive';
import {getClient, getCurrency, isTestnet, setRpc} from 'utils/hive';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import getCurrencyArray from '__tests__/utils-for-testing/data/array-cases/success/get-currency-array';
import setRpcArray from '__tests__/utils-for-testing/data/array-cases/success/set-rpc-array';
import testRpcObj from '__tests__/utils-for-testing/data/test-rpcObj';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import method from '__tests__/utils-for-testing/helpers/method';
import broadcastOperationArray from '__tests__/utils-for-testing/data/array-cases/success/broadcast-operation-array';
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
    const {cases: opCases} = broadcastOperationArray;
    const {sucess: successResponse} = testBroadcastResponse;
    it('Must return success response on each case', async () => {
      // powerUp  powerDown delegate convert
      //depositToSavings withdrawFromSavings vote  voteForWitness
      // setProxy createClaimedAccount
      hiveUtilsMocks.broadcast(successResponse);
      for (let i = 0; i < opCases.length; i++) {
        const {assertion} = opCases[i];
        await assertion(successResponse);
        method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
      }
    });
    //missing as they do not share same Operation name:
    //  - broadcastJson
  });
});
