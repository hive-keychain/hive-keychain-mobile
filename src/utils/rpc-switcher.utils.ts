import {Rpc} from 'actions/interfaces';
import {setDisplayChangeRpcPopup, setSwitchToRpc} from 'actions/rpc-switcher';
import {RootState, store} from 'store';
import {rpcList} from './hiveUtils';
import {checkRpcStatus} from './rpc.utils';

export const useWorkingRPC = async (activeRpc?: Rpc) => {
  // const switchAuto = await LocalStorageUtils.getValueFromLocalStorage(
  //   LocalStorageKeyEnum.SWITCH_RPC_AUTO,
  // );
  // const currentRpc = activeRpc || (await store.getState().activeRpc);
  const state: RootState = await store.getState();
  const currentRpc: Rpc = state.settings.rpc as Rpc;
  for (const rpc of rpcList.filter(
    (rpc) => rpc.uri !== currentRpc?.uri && !rpc.testnet,
  )) {
    if (await checkRpcStatus(rpc.uri)) {
      // if (switchAuto) {
      //   store.dispatch(setActiveRpc(rpc));
      // } else {
      console.log('found: ', {rpc}); //TODO remove line
      store.dispatch(setSwitchToRpc(rpc));
      store.dispatch(setDisplayChangeRpcPopup(true));
      // }
      return;
    }
  }
};
