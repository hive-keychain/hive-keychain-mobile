import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducers from './src/reducers';
import App from './src/App';
import {name as appName} from './app.json';

const store = createStore(reducers, applyMiddleware(thunk));

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
