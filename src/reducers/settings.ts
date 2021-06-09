import {SET_RPC} from 'actions/types';
import {actionPayload, settings} from 'actions/interfaces';

export default (
  state: settings = {rpc: 'DEFAULT'},
  {type, payload}: actionPayload<string>,
) => {
  switch (type) {
    case SET_RPC:
      return {...state, rpc: payload};
    default:
      return state;
  }
};
