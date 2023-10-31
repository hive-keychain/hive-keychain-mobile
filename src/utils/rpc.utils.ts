import AsyncStorage from '@react-native-community/async-storage';
import {Rpc} from 'actions/interfaces';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';

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
