import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './src/App';
import Loading from './src/screens/Loading';
import {name as appName} from './app.json';
import {store, persistor} from './src/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);

  const onBeforeLift = () => {
    // Take an action before the gate lifts
    setTimeout(() => {
      setGateLifted(true);
    }, 3000);
  };
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar backgroundColor="black" />

        <PersistGate
          loading={<Loading />}
          persistor={persistor}
          onBeforeLift={onBeforeLift}>
          {gateLifted ? <App /> : <Loading />}
        </PersistGate>
      </SafeAreaProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
