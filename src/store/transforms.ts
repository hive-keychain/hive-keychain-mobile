import {Settings} from 'actions/interfaces';
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

export default [rpcTransformer];
