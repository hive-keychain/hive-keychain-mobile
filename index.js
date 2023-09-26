import 'react-native-gesture-handler';
import './global';

import ErrorBoundary from 'components/errors/ErrorBoundary';
import React, {useState} from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import MultichainApp from 'src/MultichainApp';
import {persistor, store} from 'store';
import {name as appName} from './app.json';

const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);

  const onBeforeLift = () => {
    // Take an action before the gate lifts
    setGateLifted(true);
  };
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar backgroundColor="black" />
          <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
            {gateLifted ? <MultichainApp /> : null}
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

AppRegistry.registerComponent(appName, () => Root);
