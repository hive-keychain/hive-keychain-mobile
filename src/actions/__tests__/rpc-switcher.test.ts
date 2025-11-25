import {
  setSwitchToRpc,
  setDisplayChangeRpcPopup,
} from '../rpc-switcher';
import {SET_SWITCH_TO_RPC, SET_DISPLAY_SWITCH_RPC} from '../types';
import {Rpc} from '../interfaces';

describe('rpc-switcher actions', () => {
  describe('setSwitchToRpc', () => {
    it('should create action to set switch to RPC', () => {
      const rpc: Rpc = {uri: 'https://rpc.com', testnet: false} as Rpc;
      const action = setSwitchToRpc(rpc);
      expect(action.type).toBe(SET_SWITCH_TO_RPC);
      expect(action.payload).toEqual(rpc);
    });
  });

  describe('setDisplayChangeRpcPopup', () => {
    it('should create action to display RPC popup', () => {
      const action = setDisplayChangeRpcPopup(true);
      expect(action.type).toBe(SET_DISPLAY_SWITCH_RPC);
      expect(action.payload).toBe(true);
    });

    it('should create action to hide RPC popup', () => {
      const action = setDisplayChangeRpcPopup(false);
      expect(action.payload).toBe(false);
    });
  });
});
