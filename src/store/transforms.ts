import {Settings} from 'actions/interfaces';
import {HAS_State} from 'reducers/hiveAuthenticationService';
import createTransform from 'redux-persist/es/createTransform';

const rpcTransformer = createTransform(
  (inboundState) => {
    return inboundState;
  },
  (outboundState, key) => {
    if (
      key === 'settings' &&
      typeof (outboundState as Settings).rpc === 'string'
    ) {
      return {
        ...(outboundState as Settings),
        rpc: {uri: (outboundState as Settings).rpc, testnet: false},
      };
    }

    return outboundState;
  },
  {whitelist: ['settings']},
);

const hiveAuthenticationServiceTransformer = createTransform<
  HAS_State,
  HAS_State,
  any,
  any
>(
  (inboundState) => {
    return {
      instances: inboundState.instances.map((e) => {
        e.init = false;
        delete e.server_key;
        return e;
      }),
      sessions: inboundState.sessions
        .filter((e) => e.token && e.token.expiration > Date.now())
        .map((e) => {
          e.init = false;
          return e;
        }),
    };
  },
  (outboundState, key) => {
    return outboundState;
  },
  {whitelist: ['hive_authentication_service']},
);

export default [rpcTransformer, hiveAuthenticationServiceTransformer];
