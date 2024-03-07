import AsyncStorage from '@react-native-community/async-storage';
import reducers from 'reducers/index';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import transforms from './transforms';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'lastAccount',
    'settings',
    'browser',
    'preferences',
    'hive_authentication_service',
    'historyFilters',
    'tokensFilters',
  ],
  transforms,
};
const persistConfig2 = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['lastAccount', 'settings', 'browser', 'preferences'],
};

const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers, applyMiddleware(thunk));
const persistedReducers2 = persistReducer(persistConfig2, reducers);
const store2 = createStore(persistedReducers2, applyMiddleware(thunk));
const persistor = persistStore(store);

const getSafeState = () => {
  const state: RootState = {...store.getState()};
  state.accounts.forEach((e) => delete e.keys);
  delete state.activeAccount.keys;
  delete state.auth;
  delete state.conversions;
  delete state.phishingAccounts;
  delete state.activeAccount.account;
  delete state._persist;
  for (const e in state) {
    //@ts-ignore
    delete state[e]._persist;
  }
  return state;
};

export {getSafeState, persistor, store};

export type RootState = ReturnType<typeof store2.getState>;
export type AppDispatch = typeof store.dispatch;
