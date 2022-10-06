import {Rpc} from 'actions/interfaces';
import testHiveApi from './test-hive-api';

export default {
  _default: {
    uri: 'DEFAULT',
    testnet: false,
  } as Rpc,
  hiveRpc: {
    uri: testHiveApi._default,
    testnet: false,
  } as Rpc,
  testMan: {
    uri: 'https://saturnoman.com/hive',
    testnet: true,
    chainId: '0000000000',
  } as Rpc,
};
