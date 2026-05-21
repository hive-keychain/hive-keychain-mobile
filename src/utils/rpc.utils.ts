import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rpc} from 'actions/interfaces';
import axios from 'axios';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {HiveRpcConfig} from './config.utils';

export const getCustomRpcs = async (): Promise<Rpc[]> => {
  let customRpcs: Rpc[];
  const rawObject = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.CUSTOM_RPC_LIST,
  );
  if (rawObject) {
    try {
      customRpcs = JSON.parse(rawObject);
    } catch (error) {
      console.log('Error getting custom RPCs');
    }
  }
  return customRpcs ? customRpcs : ([] as Rpc[]);
};

export const addCustomRpc = async (rpc: Rpc): Promise<void> => {
  const savedCustomRpcList = await getCustomRpcs();
  if (!savedCustomRpcList.find((savedRpc) => savedRpc.uri === rpc.uri)) {
    savedCustomRpcList.push(rpc);
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.CUSTOM_RPC_LIST,
      JSON.stringify(savedCustomRpcList),
    );
  }
};

export const deleteCustomRpc = async (rpcs: Rpc[], rpc: Rpc) => {
  const newRpcs = rpcs.filter((r) => rpc.uri !== r.uri);
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.CUSTOM_RPC_LIST,
    JSON.stringify(newRpcs),
  );
};

export const getRPCUri = (rpcObj: string | Rpc) => {
  return typeof rpcObj === 'object' ? rpcObj.uri : rpcObj;
};

const getRpcStatusUri = (uri: string) =>
  ['DEFAULT', 'https://api.hive.blog'].includes(uri)
    ? 'https://api.hive.blog'
    : uri;

export const checkRpcStatus = async (uri: string) => {
  try {
    const result = await axios.post(
      getRpcStatusUri(uri),
      {
        jsonrpc: '2.0',
        method: 'condenser_api.get_dynamic_global_properties',
        params: [],
        id: 1,
      },
      {
        timeout: HiveRpcConfig.REQUEST_TIMEOUT_MS,
      },
    );
    return !!result?.data?.result && !result?.data?.error;
  } catch (err) {
    console.log('Error RPC status check: ', {err});
    return false;
  }
};
