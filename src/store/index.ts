import AsyncStorage from "@react-native-async-storage/async-storage";
import reducers from "reducers/index";
import {
  AnyAction,
  applyMiddleware,
  createStore,
  Middleware,
  Reducer,
} from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import transforms from "./transforms";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "lastAccount",
    "settings",
    "browser",
    "preferences",
    "hive_authentication_service",
    "historyFilters",
    "tokensFilters",
    "accountValueDisplay",
  ],
  transforms,
};
const persistConfig2 = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["lastAccount", "settings", "browser", "preferences"],
};

const persistedReducers = persistReducer<
  ReturnType<typeof reducers>,
  AnyAction
>(
  persistConfig,
  reducers as unknown as Reducer<ReturnType<typeof reducers>, AnyAction>
);
const store = createStore(
  persistedReducers,
  applyMiddleware(thunk as unknown as Middleware)
);
const persistedReducers2 = persistReducer<
  ReturnType<typeof reducers>,
  AnyAction
>(
  persistConfig2,
  reducers as unknown as Reducer<ReturnType<typeof reducers>, AnyAction>
);
const store2 = createStore(
  persistedReducers2,
  applyMiddleware(thunk as unknown as Middleware)
);
const persistor = persistStore(store);

const getSafeState = () => {
  const state: RootState = { ...store.getState() };
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

export { getSafeState, persistor, store };

export type RootState = ReturnType<typeof store2.getState>;
export type AppDispatch = typeof store.dispatch;
