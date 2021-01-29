import {SET_RPC} from 'actions/types';

export default (state = {rpc: 'DEFAULT'}, {type, payload}) => {
  switch (type) {
    case SET_RPC:
      return {...state, rpc: payload};
    default:
      return state;
  }
};
