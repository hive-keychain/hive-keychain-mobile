import {createTransform} from 'redux-persist';

const EncryptTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key, fullState) => {
    console.log('save', inboundState, key);
    return inboundState;
    //   const mk = fullState.auth.mk;
    //   console.log('save state');
    //   if (mk && inboundState.length) {
    //     const encrypted = encryptJson({list: inboundState}, mk);
    //     console.log(encrypted);
    //     return encrypted;
    //   }
    //   return null;
  },
  // transform state being rehydrated
  (outboundState, key, fullState) => {
    console.log('load state');
    console.log(outboundState, key);
    return outboundState;
  },
  // define which reducers this transform gets called for.
  {whitelist: ['accountsEncrypted']},
);

export {EncryptTransform};
