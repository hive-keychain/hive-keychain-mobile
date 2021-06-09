import {SET_RPC} from 'actions/types';
import {actionPayload, settings, settingsPayload} from 'actions/interfaces';

export default (
  state: settings = {rpc: 'DEFAULT'},
  {type, payload}: actionPayload<settingsPayload>,
) => {
  switch (type) {
    case SET_RPC:
      return {...state, rpc: payload!.rpc!};
    default:
      return state;
  }
};
