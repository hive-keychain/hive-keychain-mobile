import React from 'react';
import {Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from 'store';
import {initialEmptyStateStore} from '__tests__/utils-for-testing/data/test-initial-state';
import {
  getFakeStore,
  RootState,
} from '__tests__/utils-for-testing/store/fake-store';

const FakeComponent = () => {
  return (
    <Provider
      store={getFakeStore({
        ...initialEmptyStateStore,
        phishingAccounts: ['1', '2'],
      } as RootState)}>
      <PersistGate persistor={persistor}>
        <View>
          <Text>Hi. Fake component over kere!</Text>
        </View>
      </PersistGate>
    </Provider>
  );
};

export default FakeComponent;
