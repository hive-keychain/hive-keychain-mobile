import {ActionPayload, Settings, SettingsPayload} from 'actions/interfaces';
import {
  SET_HIVE_ACCOUNT_HISTORY_RPC,
  SET_HIVE_ENGINE_RPC,
  SET_MOBILE_SETTINGS,
  SET_RPC,
} from 'actions/types';
import {
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_HE_RPC_NODE,
} from 'screens/hive/settings/RpcNodes';
import {DEFAULT_RPC} from 'utils/hiveUtils';

export default (
  state: Settings = {
    rpc: DEFAULT_RPC,
    hiveEngineRpc: DEFAULT_HE_RPC_NODE,
    accountHistoryAPIRpc: DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
    mobileSettings: {
      platformRelevantFeatures: {
        swap: ['android'],
        externalOnboarding: ['android'],
      },
    },
  },
  {type, payload}: ActionPayload<SettingsPayload>,
) => {
  switch (type) {
    case SET_RPC:
      return {...state, rpc: payload!.rpc!};
    case SET_HIVE_ENGINE_RPC:
      return {...state, hiveEngineRpc: payload!.hiveEngineRpc!};
    case SET_HIVE_ACCOUNT_HISTORY_RPC:
      return {...state, accountHistoryAPIRpc: payload!.accountHistoryAPIRpc!};
    case SET_MOBILE_SETTINGS:
      return {...state, mobileSettings: payload!.mobileSettings!};
    default:
      return state;
  }
};
