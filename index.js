import 'react-native-gesture-handler';
import './global';
import React, {useState} from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from 'src/App';
import Loading from 'screens/Loading';
import {name as appName} from './app.json';
import {store, persistor} from 'store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);

  const onBeforeLift = () => {
    // Take an action before the gate lifts
    setTimeout(() => {
      setGateLifted(true);
    }, 1000);
  };
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar backgroundColor="black" />
        <PersistGate
          loading={<Loading />}
          persistor={persistor}
          onBeforeLift={onBeforeLift}>
          {gateLifted ? <App /> : <Loading />}
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
