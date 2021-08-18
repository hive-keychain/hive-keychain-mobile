import AsyncStorage from '@react-native-community/async-storage';
import reducers from 'reducers/index';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import transforms from './transforms';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['lastAccount', 'settings', 'browser', 'preferences'],
  transforms,
};

const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
