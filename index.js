import 'react-native-gesture-handler';
import './global';
import React, {useState} from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from 'src/App';
import {name as appName} from './app.json';
import {store, persistor} from 'store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);

  const onBeforeLift = () => {
    // Take an action before the gate lifts
    setGateLifted(true);
  };
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar backgroundColor="black" />
        <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
          {gateLifted ? <App /> : null}
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
