import 'react-native-gesture-handler';
import './global';

import ErrorBoundary from 'components/errors/ErrorBoundary';
import {registerRootComponent} from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import MultichainApp from 'src/MultichainApp';
import {persistor, store} from 'store';

const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const onBeforeLift = () => {
    // Take an action before the gate lifts
    setTimeout(() => {
      SplashScreen.hideAsync({fade: false});
    }, 200);
    setGateLifted(true);
  };
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Provider store={store}>
          <RootSiblingParent>
            <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
              <GestureHandlerRootView
                style={{flex: 1, backgroundColor: '#212838'}}>
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
