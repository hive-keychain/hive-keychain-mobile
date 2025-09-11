import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_ACCOUNT_HISTORY_RPCS,
  DEFAULT_HE_RPC_NODE,
  DEFAULT_HIVE_ENGINE_RPCS,
  HiveEngineConfig,
} from 'src/interfaces/hiveEngineRpc.interface';

let rpc = DEFAULT_HE_RPC_NODE;

let accountHistoryApi = DEFAULT_ACCOUNT_HISTORY_RPC_NODE;

const getApi = () => {
  return rpc;
};
const setActiveApi = (api: string) => {
  rpc = api;
};

const getAccountHistoryApi = () => {
  return accountHistoryApi;
};
const setActiveAccountHistoryApi = (api: string) => {
  accountHistoryApi = api;
};

const getHiveEngineRpcList = async (dynamicEnabled: boolean = false) => {
  if (dynamicEnabled) {
    return [];
  }
  return DEFAULT_HIVE_ENGINE_RPCS;
};

const switchToNextRpc = async () => {
  const rpcList = await getHiveEngineRpcList();
  const index = rpcList.indexOf(getApi());
  const nextApi = rpcList[(index + 1) % rpcList.length];
  setActiveApi(nextApi);
  return nextApi;
};

/**
 * note: HIVE_ENGINE_CUSTOM_RPC_LIST
 */
const addCustomRpc = async (api: string) => {
  const savedCustomRpcs = await HiveEngineConfigUtils.getCustomRpcs();
  savedCustomRpcs.push(api);
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.HIVE_ENGINE_CUSTOM_RPC_LIST,
    JSON.stringify(savedCustomRpcs),
  );
};
const deleteCustomRpc = async (api: string) => {
  let customRpcs = (await getCustomRpcs()).filter((rpc) => rpc !== api);
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.HIVE_ENGINE_CUSTOM_RPC_LIST,
    JSON.stringify(customRpcs),
  );
  return customRpcs;
};

/**
 * note: HIVE_ENGINE_CUSTOM_RPC_LIST
 */
const getCustomRpcs = async () => {
  const customRpcs: string[] = JSON.parse(
    await AsyncStorage.getItem(
      KeychainStorageKeyEnum.HIVE_ENGINE_CUSTOM_RPC_LIST,
    ),
  );
  return customRpcs ? customRpcs : ([] as string[]);
};
const getCustomAccountHistoryApi = async () => {
  const customAccountHistoryApis: string[] = JSON.parse(
    await AsyncStorage.getItem(
      KeychainStorageKeyEnum.HIVE_ENGINE_CUSTOM_ACCOUNT_HISTORY_API,
    ),
  );
  return customAccountHistoryApis ? customAccountHistoryApis : ([] as string[]);
};
const addCustomAccountHistoryApi = async (api: string) => {
  const savedCustomAccountHistoryApis =
    await HiveEngineConfigUtils.getCustomAccountHistoryApi();
  savedCustomAccountHistoryApis.push(api);
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.HIVE_ENGINE_CUSTOM_ACCOUNT_HISTORY_API,
    JSON.stringify(savedCustomAccountHistoryApis),
  );
};
const deleteCustomAccountHistoryApi = async (api: string) => {
  let customHistoryAccountsApi = (await getCustomAccountHistoryApi()).filter(
    (rpc) => rpc !== api,
  );
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.HIVE_ENGINE_CUSTOM_ACCOUNT_HISTORY_API,
    JSON.stringify(customHistoryAccountsApi),
  );
  return customHistoryAccountsApi;
};

const isRpcDefault = (rpc: string) => {
  return DEFAULT_HIVE_ENGINE_RPCS.includes(rpc);
};

const isAccountHistoryApiDefault = (api: string) => {
  return DEFAULT_ACCOUNT_HISTORY_RPCS.includes(api);
};

const saveConfigInStorage = async (config: HiveEngineConfig) => {
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.HIVE_ENGINE_ACTIVE_CONFIG,
    JSON.stringify(config),
  );
};

export const HiveEngineConfigUtils = {
  getApi,
  setActiveAccountHistoryApi,
  setActiveApi,
  getAccountHistoryApi,
  addCustomRpc,
  addCustomAccountHistoryApi,
  deleteCustomRpc,
  deleteCustomAccountHistoryApi,
  getCustomRpcs,
  getCustomAccountHistoryApi,
  isRpcDefault,
  isAccountHistoryApiDefault,
  switchToNextRpc,
  saveConfigInStorage,
};
