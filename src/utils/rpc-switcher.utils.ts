import AsyncStorage from '@react-native-community/async-storage';
import {setRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {setDisplayChangeRpcPopup, setSwitchToRpc} from 'actions/rpc-switcher';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {store} from 'store';
import {rpcList} from './hiveUtils';
import {checkRpcStatus} from './rpc.utils';

export const useWorkingRPC = async (rpc?: Rpc) => {
  const switchAuto = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.SWITCH_RPC_AUTO),
  );
  const currentRpc: Rpc = rpc || (await store.getState().settings.rpc);
  for (const rpc of rpcList.filter(
    (rpc) => rpc.uri !== currentRpc?.uri && !rpc.testnet,
  )) {
    if (await checkRpcStatus(rpc.uri)) {
      if (switchAuto) {
        console.log(
          'setting rpc from zhere ===================================',
        );

        store.dispatch(setRpc(rpc));
      } else {
        store.dispatch(setSwitchToRpc(rpc));
        store.dispatch(setDisplayChangeRpcPopup(true));
      }
      return;
    }
  }
};
