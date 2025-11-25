jest.mock('expo-device', () => ({
  __esModule: true,
  default: {
    modelName: 'iPhone',
    isDevice: false,
  },
}));

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1, 2])),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('utils/navigation.utils', () => ({
  navigate: jest.fn(),
}));

jest.mock('../secureStore.utils', () => ({
  __esModule: true,
  default: {
    saveOnSecureStore: jest.fn(),
  },
}));

import StorageUtils from '../storage.utils';
import SecureStoreUtils from '../secureStore.utils';

describe('StorageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requireBiometricsLogin', () => {
    it('should require biometrics login on Android', async () => {
      const Platform = require('react-native').Platform;
      const originalOS = Platform.OS;
      Platform.OS = 'android';
      await StorageUtils.requireBiometricsLogin('masterkey', 'reason');
      expect(SecureStoreUtils.saveOnSecureStore).toHaveBeenCalled();
      Platform.OS = originalOS;
    });
  });
});
