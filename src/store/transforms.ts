import {Settings} from 'actions/interfaces';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import createTransform from 'redux-persist/es/createTransform';
import {DEFAULT_RPC} from 'utils/hiveUtils';

const rpcTransformer = createTransform<Settings, Settings>(
  (inboundState) => inboundState,
  (outboundState, key) => {
    if (key === 'settings' && typeof outboundState.rpc === 'string') {
      return {
        ...outboundState,
        rpc: {
          uri:
            outboundState.rpc === 'DEFAULT'
              ? DEFAULT_RPC.uri
              : outboundState.rpc,
          testnet: false,
        },
      } as Settings;
    }

    return outboundState;
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
