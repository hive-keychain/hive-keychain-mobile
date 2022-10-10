import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {WebSocket} from 'mock-socket';
global.WebSocket = WebSocket;

/**
 * As you need add more vars into the required file and use on each initial
 * mock.
 * Note: to be used by jest needs a prefix mock in the vars name
 */
const mockInitialData = require('./__tests__/utils-for-testing/config-test/data-initial-mocks');

//Updates:
//jest-websocket-mock not needed for now.
// {...,Server} from mock-server, not being used for now.
//Object.assign(global, require('jest-chrome')); for now not needed.

//////native gesture handler & native reanimated & view native component
import {View} from 'react-native';
import 'react-native-gesture-handler/jestSetup';

export const enableScreens = jest.fn();
export const screensEnabled = jest.fn().mockReturnValue(false);
export const ScreenContainer = View;

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
//////END native gesture handler & native reanimated

jest.mock('react-native-localize', () => {
  return {getLocales: jest.fn().mockReturnValue(['en'])};
});

jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  };
});
//for later may be needed:
//jest.mock('redux-persist/integration/react', () => ({   PersistGate: (props: any) => props.children, }))

//related to
// - react-native-background-timer
// - Invariant Violation: `new NativeEventEmitter()` requires a non-null argument. (Error while testing)
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

//firebase relates
jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: jest.fn(),
    setUserProperties: jest.fn(),
    setUserId: jest.fn(),
    setCurrentScreen: jest.fn(),
  });
});
jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logScreenView: jest.fn().mockImplementation((...args) => {
      const {
        causeError,
        errorMessage,
      } = mockInitialData.default.firebase.analytics.logScreenView;
      return causeError
        ? new Promise.reject(new Error(errorMessage))
        : new Promise.resolve(undefined);
    }),
  });
});
//end firebase
