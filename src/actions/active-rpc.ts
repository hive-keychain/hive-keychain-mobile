import {setRpc} from 'utils/hive';
import {Rpc} from './interfaces';
import {SET_ACTIVE_RPC} from './types';

export const setActiveRpc = (rpc: Rpc) => {
  //TODO check & cleanup
  setRpc(rpc);
  // chrome.runtime.sendMessage({
  //   command: BackgroundCommand.SAVE_RPC,
  //   value: rpc,
  // });
  return {
    type: SET_ACTIVE_RPC,
    payload: rpc,
  };
};
