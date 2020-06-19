import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reducers from '../reducers';
import {EncryptTransform} from './transform';

const persistConfig = {
  key: 'config',
  storage: AsyncStorage,
  whitelist: ['accountsEncrypted'],
  blacklist: ['auth', 'accounts'],
  transforms: [EncryptTransform],
};

const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};
