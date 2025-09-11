import AsyncStorage from '@react-native-async-storage/async-storage';
import {setRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {setDisplayChangeRpcPopup, setSwitchToRpc} from 'actions/rpc-switcher';
import {rpcList} from 'lists/rpc.list';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {store} from 'store';
import {checkRpcStatus} from './rpc.utils';

export const useWorkingRPC = async (rpc?: Rpc) => {
  const switchAuto = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.SWITCH_RPC_AUTO,
  );
  const isSwitchAuto = switchAuto === 'true' || switchAuto === null;

  const currentRpc: Rpc = rpc || (await store.getState().settings.rpc);
  for (const rpc of rpcList.filter(
    (rpc) => rpc.uri !== currentRpc?.uri && !rpc.testnet,
  )) {
    if (await checkRpcStatus(rpc.uri)) {
      if (isSwitchAuto) {
        store.dispatch(setRpc(rpc));
      } else {
        store.dispatch(setSwitchToRpc(rpc));
        store.dispatch(setDisplayChangeRpcPopup(true));
      }
      return;
    }
  }
};
