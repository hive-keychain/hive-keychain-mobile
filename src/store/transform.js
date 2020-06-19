import {createTransform} from 'redux-persist';
import {encryptJson, decryptToJson} from '../utils/encrypt';
const EncryptTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key, fullState) => {
    const mk = fullState.auth.mk;
    if (mk) {
      console.log('save state');
      const encrypted = encryptJson({list: inboundState}, mk);
      console.log(encrypted);
      return encrypted;
    }
  },
  // transform state being rehydrated
  (outboundState, key, fullState) => {
    console.log('load state');
    console.log(outboundState);
    return [];
  },
  // define which reducers this transform gets called for.
  {whitelist: ['accounts']},
);

export {EncryptTransform};
