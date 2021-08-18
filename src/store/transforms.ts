import {Settings} from 'actions/interfaces';
import createTransform from 'redux-persist/es/createTransform';

const rpcTransformer = createTransform(
  (inboundState: Settings): Settings => {
    return inboundState;
  },
  (outboundState: Settings, key): Settings => {
    if (key === 'settings' && typeof outboundState.rpc === 'string') {
      return {...outboundState, rpc: {uri: outboundState.rpc, testnet: false}};
    }

    return outboundState;
  },
  {whitelist: ['settings']},
);

export default [rpcTransformer];
