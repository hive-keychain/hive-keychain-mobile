import AsyncStorage from '@react-native-community/async-storage';
import reducers from 'reducers/index';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import transforms from 'src/store/transforms';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'lastAccount',
    'settings',
    'browser',
    'preferences',
    'hive_authentication_service',
  ],
  transforms,
};
const persistConfig2 = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['lastAccount', 'settings', 'browser', 'preferences'],
};

const persistedReducers = persistReducer(persistConfig, reducers);
const fakestore = createStore(persistedReducers, applyMiddleware(thunk));
const persistedReducers2 = persistReducer(persistConfig2, reducers);
const fakestore2 = createStore(persistedReducers2, applyMiddleware(thunk));
const fakepersistor = persistStore(fakestore);

export const getFakeStore = (initialState?: RootState) => {
    return createStore(reducers, initialState, applyMiddleware(thunk));
  };

export {fakestore, fakepersistor};

export type RootState = ReturnType<typeof fakestore2.getState>;
export type AppDispatch = typeof fakestore.dispatch;