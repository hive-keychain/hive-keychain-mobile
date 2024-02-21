import {ActionPayload, Rpc} from 'actions/interfaces';
import {SET_ACTIVE_RPC} from 'actions/types';

const ActiveRpcReducer = (
  state: Rpc = {uri: 'NULL', testnet: false},
  {type, payload}: ActionPayload<Rpc>,
) => {
  switch (type) {
    case SET_ACTIVE_RPC:
      return payload;
    default:
      return state;
  }
};

export default ActiveRpcReducer;
