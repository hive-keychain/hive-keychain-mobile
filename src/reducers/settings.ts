import {ActionPayload, Settings, SettingsPayload} from 'actions/interfaces';
import {SET_RPC} from 'actions/types';

export default (
  state: Settings = {rpc: 'DEFAULT'},
  {type, payload}: ActionPayload<SettingsPayload>,
) => {
  switch (type) {
    case SET_RPC:
      return {...state, rpc: payload!.rpc!};
    default:
      return state;
  }
};
