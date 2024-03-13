import {ActionPayload, Rpc} from 'actions/interfaces';
import {SET_DISPLAY_SWITCH_RPC, SET_SWITCH_TO_RPC} from 'actions/types';

type Switcher = {
  display: boolean;
  rpc?: Rpc;
};
const RpcSwitcherReducer = (
  state: Switcher = {display: false},
  {type, payload}: ActionPayload<boolean | Rpc>,
): Switcher => {
  switch (type) {
    case SET_SWITCH_TO_RPC:
      return {...state, rpc: payload as Rpc};
    case SET_DISPLAY_SWITCH_RPC:
      return {...state, display: payload as boolean};
    default:
      return state;
  }
};

export default RpcSwitcherReducer;
