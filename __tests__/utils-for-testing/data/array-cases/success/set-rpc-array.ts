import {getClient} from 'utils/hive';
import apiKeychainMocks from '__tests__/utils-for-testing/mocks/as-module/api-keychain-mocks';
import testHiveApi from '../../test-hive-api';
import testRpcObj from '../../test-rpcObj';
import hiveTx from 'hive-tx';
import objects from '__tests__/utils-for-testing/helpers/objects';
import {Rpc} from 'actions/interfaces';
import testChainId from '../../test-chain-id';

const cases = [
  {
    titleTest: 'Must set Rpc client as hive api',
    note: 'rpcObj as string',
    rpcObj: 'DEFAULT',
    mocking: () => {
      apiKeychainMocks.get({data: {rpc: testHiveApi._default}});
    },
    assertion: () => {
      expect(getClient().address).toBe(testHiveApi._default);
      expect(hiveTx.config.node).toBe(testHiveApi._default);
    },
  },
  {
    titleTest: 'Must set Rpc client as custom api',
    note: 'rpcObj as Object with tesnet property',
    rpcObj: testRpcObj.testMan,
    mocking: () => {},
    assertion: () => {
      expect(getClient().address).toBe(testRpcObj.testMan.uri);
      expect(hiveTx.config.node).toBe(testRpcObj.testMan.uri);
      expect(getClient().chainId).toEqual(
        Buffer.from(testRpcObj.testMan.chainId),
      );
      expect(hiveTx.config.chain_id).toEqual(testRpcObj.testMan.chainId);
    },
  },
  {
    titleTest: 'If error, must set Rpc client as default rpc',
    note: 'rpcObj as Object with tesnet property',
    rpcObj: 'DEFAULT',
    mocking: () => {
      apiKeychainMocks.get(
        {data: {rpc: testHiveApi._default}},
        new Error('Network or Api error!'),
      );
    },
    assertion: () => {
      expect(getClient().address).toBe(testHiveApi._default);
      expect(hiveTx.config.node).toBe(testHiveApi._default);
    },
  },
  {
    titleTest: 'Must set testnet as false & chainId as default',
    note: 'rpcObj as Object just uri',
    rpcObj: objects.cloneAndRemoveObjProperties(testRpcObj.testMan, [
      'testnet',
      'chainId',
    ]) as Rpc,
    mocking: () => {},
    assertion: () => {
      expect(getClient().address).toBe(testRpcObj.testMan.uri);
      expect(hiveTx.config.node).toBe(testRpcObj.testMan.uri);
      expect(getClient().chainId).toEqual(Buffer.from(testChainId._default));
      expect(hiveTx.config.chain_id).toEqual(testChainId._default);
    },
  },
];

export default {cases};
