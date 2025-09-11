import {Rpc, Settings} from 'actions/interfaces';
import {DEFAULT_RPC} from 'lists/rpc.list';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import createTransform from 'redux-persist/es/createTransform';
import {
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_HE_RPC_NODE,
} from 'src/interfaces/hiveEngineRpc.interface';

const rpcTransformer = createTransform<Settings, Settings>(
  (outboundState) => outboundState,
  (inboundState, key) => {
    if (key === 'settings') {
      let rpc: Rpc | string = inboundState.rpc;
      if (
        (typeof rpc === 'string' && rpc === 'DEFAULT') ||
        rpc?.uri === 'DEFAULT'
      )
        rpc = DEFAULT_RPC;
      return {
        ...inboundState,
        rpc: {
          uri: rpc.uri,
          testnet: false,
        },
        hiveEngineRpc: inboundState.hiveEngineRpc || DEFAULT_HE_RPC_NODE,
        accountHistoryAPIRpc:
          inboundState.accountHistoryAPIRpc || DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
      } as Settings;
    }

    return inboundState;
  },
  {whitelist: ['settings']},
);

const hiveAuthenticationServiceTransformer = createTransform<
  HAS_State,
  HAS_State
>(
  (inboundState, key, state) => {
    if (state?.auth?.mk) return inboundState;
    const sessions = inboundState.sessions
      .filter((e) => e.token && e.token.expiration > Date.now())
      .map((e) => {
        e.init = false;
        return e;
      });
    return {
      instances: inboundState.instances
        .filter((e) => !!sessions.find((session) => e.host === session.host))
        .map((e) => {
          e.init = false;
          delete e.server_key;
          delete e.connected;
          return e;
        }),
      sessions,
    };
  },
  (outboundState) => outboundState,
  {whitelist: ['hive_authentication_service']},
);

export default [rpcTransformer, hiveAuthenticationServiceTransformer];
