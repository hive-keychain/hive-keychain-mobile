import analytics from '@react-native-firebase/analytics';

export default {
  analytics: analytics().logScreenView = jest
    .fn()
    .mockImplementation((...args) => undefined),
};
