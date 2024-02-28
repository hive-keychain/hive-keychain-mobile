import AsyncStorage from '@react-native-community/async-storage';
import {setActiveRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {setDisplayChangeRpcPopup, setSwitchToRpc} from 'actions/rpc-switcher';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {store} from 'store';
import {rpcList} from './hiveUtils';
import {checkRpcStatus} from './rpc.utils';

export const useWorkingRPC = async (activeRpc?: Rpc) => {
  //TODO bellow cleanup
  // const state: RootState = await store.getState();
  // const currentRpc: Rpc = state.settings.rpc as Rpc;
  // for (const rpc of rpcList.filter(
  //   (rpc) => rpc.uri !== currentRpc?.uri && !rpc.testnet,
  // )) {
  //   if (await checkRpcStatus(rpc.uri)) {
  //     store.dispatch(setSwitchToRpc(rpc));
  //     store.dispatch(setDisplayChangeRpcPopup(true));
  //     return;
  //   }
  // }

  const switchAuto = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.SWITCH_RPC_AUTO),
  );
  console.log('RpcSwitcher:', {switchAuto}); //TODO remove line
  const currentRpc: Rpc = activeRpc || (await store.getState().activeRpc);
  for (const rpc of rpcList.filter(
    (rpc) => rpc.uri !== currentRpc?.uri && !rpc.testnet,
  )) {
    if (await checkRpcStatus(rpc.uri)) {
      if (switchAuto) {
        store.dispatch(setActiveRpc(rpc));
      } else {
        console.log('About to setSwitchToRpc:', {rpc}); //TODO remove line
        store.dispatch(setSwitchToRpc(rpc));
        store.dispatch(setDisplayChangeRpcPopup(true));
      }
      return;
    }
  }
};
