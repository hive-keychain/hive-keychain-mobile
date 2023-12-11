import {ActionPayload, Settings, SettingsPayload} from 'actions/interfaces';
import {SET_RPC} from 'actions/types';

export default (
  state: Settings = {rpc: 'DEFAULT'},
  {type, payload}: ActionPayload<SettingsPayload>,
) => {
  switch (type) {
    case SET_RPC:
      console.log('Set rpc: ', {rpc: payload.rpc}); //TODO remove line
      return {...state, rpc: payload!.rpc!};
    default:
      return state;
  }
};
