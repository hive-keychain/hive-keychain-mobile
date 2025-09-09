import 'react-native-gesture-handler';
import './global';

import ErrorBoundary from 'components/errors/ErrorBoundary';
import {registerRootComponent} from 'expo';
import React, {useState} from 'react';
import {LogBox, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import MultichainApp from 'src/MultichainApp';
import {persistor, store} from 'store';
const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    "Looks like you're passing an inline function",
    "EventEmitter.removeListener('change', ...): ",
    'ViewPropTypes will be removed from React Native',
    "EventEmitter.removeListener('appStateDidChange', ...)",
    'Require cycle',
    '`new NativeEventEmitter()` was called with a non-null',
    'Warning: Cannot update a component',
  ]);

  const onBeforeLift = () => {
    // Take an action before the gate lifts
    setGateLifted(true);
  };
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar backgroundColor="black" />
          <RootSiblingParent>
            <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
              <GestureHandlerRootView style={{flex: 1}}>
                {gateLifted ? <MultichainApp /> : null}
              </GestureHandlerRootView>
            </PersistGate>
          </RootSiblingParent>
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

registerRootComponent(Root);
