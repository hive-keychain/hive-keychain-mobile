// --- Disable deprecated jest-native matchers ---
/* @testing-library/jest-native is deprecated, using built-ins from @testing-library/react-native */

// -----------------------------------------
// Load environment variables from .env
// -----------------------------------------
require('dotenv').config();

// -----------------------------------------
// Core mocks
// -----------------------------------------
import {jest} from '@jest/globals';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1, 2])),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  parse: jest.fn(),
}));

jest.mock('react-native-root-toast', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

// -----------------------------------------
// expo-device (FIX for requireNativeModule error)
// -----------------------------------------
jest.mock('expo-device', () => ({
  brand: 'Apple',
  modelName: 'iPhone 15',
  osName: 'iOS',
  osVersion: '17.0',
  isDevice: true,
}));

// -----------------------------------------
// React Navigation
// -----------------------------------------
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({params: {}}),
  };
});

// -----------------------------------------
// ViewShot
// -----------------------------------------
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(() => Promise.resolve('mock-uri')),
  releaseCapture: jest.fn(),
}));

// -----------------------------------------
// Firebase
// -----------------------------------------
jest.mock('@react-native-firebase/app', () => ({
  apps: [],
  initializeApp: jest.fn(),
}));

jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: () => ({
    logEvent: jest.fn(),
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
  }),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  __esModule: true,
  default: () => ({
    recordError: jest.fn(),
    log: jest.fn(),
  }),
}));

// -----------------------------------------
// i18n
// -----------------------------------------
jest.mock('utils/localize', () => ({
  translate: (key, params) =>
    params ? `${key} ${JSON.stringify(params)}` : key,
}));

// -----------------------------------------
// expo-constants (virtual: not always hoisted to top-level node_modules)
// -----------------------------------------
jest.mock(
  'expo-constants',
  () => ({
    __esModule: true,
    default: {
      expoConfig: {
        version: '2.10.1',
      },
    },
  }),
  { virtual: true },
);

// -----------------------------------------
// package.json
// -----------------------------------------
jest.mock(
  'package.json',
  () => ({
    name: 'mobile-keychain',
    version: '2.10.1',
  }),
  {virtual: true},
);

// -----------------------------------------
// Navigation utils
// -----------------------------------------
jest.mock('utils/navigation.utils', () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  resetStackAndNavigate: jest.fn(),
}));

// -----------------------------------------
// expo-modules-core (must be before expo-image)
// -----------------------------------------
jest.mock('expo-modules-core', () => {
  const EventEmitter = jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
  }));

  return {
    __esModule: true,
    EventEmitter,
    default: {EventEmitter},
    NativeModulesProxy: {
      ExpoScreenOrientation: {lockAsync: jest.fn()},
      ExpoDevice: {isDevice: true},
      NativeUnimoduleProxy: {viewManagersNames: []},
    },
    requireNativeViewManager: jest.fn(),
  };
});

// -----------------------------------------
// expo-image
// -----------------------------------------
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// -----------------------------------------
// Prevent background workers from starting in Jest
// (Fixes setInterval open handle warnings)
// -----------------------------------------
jest.mock('src/background/index', () => ({}));

// -----------------------------------------
// react-native-webview
// -----------------------------------------
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

// -----------------------------------------
// Silence noisy logs
// -----------------------------------------
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
