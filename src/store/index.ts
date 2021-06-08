import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reducers from 'reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['lastAccount', 'settings', 'browser'],
};

const persistedReducers = persistReducer<any, any>(persistConfig, reducers);
const store = createStore(persistedReducers, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
