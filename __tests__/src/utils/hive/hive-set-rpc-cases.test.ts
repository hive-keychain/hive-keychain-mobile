import {Rpc} from 'actions/interfaces';
import hiveTx from 'hive-tx';
import {getClient, setRpc} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testChainId from '__tests__/utils-for-testing/data/test-chain-id';
import testHiveApi from '__tests__/utils-for-testing/data/test-hive-api';
import testRpcObject from '__tests__/utils-for-testing/data/test-rpc-object';
import objects from '__tests__/utils-for-testing/helpers/objects';
import apiKeychainMocks from '__tests__/utils-for-testing/mocks/as-module/api-keychain-mocks';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/setRpc cases:\n', () => {
  it('Must set Rpc client as hive api', async () => {
    apiKeychainMocks.get({data: {rpc: testHiveApi._default}});
    expect(await setRpc('DEFAULT')).toBeUndefined();
    expect(getClient().address).toBe(testHiveApi._default);
    expect(hiveTx.config.node).toBe(testHiveApi._default);
  });

  it('Must set Rpc client as custom api', async () => {
    expect(await setRpc(testRpcObject.testMan)).toBeUndefined();
    expect(getClient().address).toBe(testRpcObject.testMan.uri);
    expect(hiveTx.config.node).toBe(testRpcObject.testMan.uri);
    expect(getClient().chainId).toEqual(
      Buffer.from(testRpcObject.testMan.chainId),
    );
    expect(hiveTx.config.chain_id).toEqual(testRpcObject.testMan.chainId);
  });

  it('If error, must set Rpc client as default rpc', async () => {
    apiKeychainMocks.get(
      {data: {rpc: testHiveApi._default}},
      new Error('Network or Api error!'),
    );
    expect(await setRpc(testRpcObject._default)).toBeUndefined();
    expect(getClient().address).toBe(testHiveApi._default);
    expect(hiveTx.config.node).toBe(testHiveApi._default);
  });

  it('Must set testnet as false & chainId as default', async () => {
    const testrRpcObjectCloned = objects.cloneAndRemoveObjProperties(
      testRpcObject.testMan,
      ['testnet', 'chainId'],
    ) as Rpc;
    expect(await setRpc(testrRpcObjectCloned)).toBeUndefined();
    expect(getClient().address).toBe(testRpcObject.testMan.uri);
    expect(hiveTx.config.node).toBe(testRpcObject.testMan.uri);
    expect(getClient().chainId).toEqual(Buffer.from(testChainId._default));
    expect(hiveTx.config.chain_id).toEqual(testChainId._default);
  });
});
