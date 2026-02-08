import {renderHook} from '@testing-library/react-native';
import useLockedPortrait from '../useLockedPortrait';
import * as ScreenOrientation from 'expo-screen-orientation';
import Orientation from 'react-native-orientation-locker';

jest.mock('expo-screen-orientation', () => ({
  lockAsync: jest.fn(),
  OrientationLock: {
    PORTRAIT_UP: 'portrait-up',
  },
}));

jest.mock('react-native-orientation-locker', () => ({
  removeAllListeners: jest.fn(),
}));

describe('useLockedPortrait', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should lock orientation to portrait on focus', () => {
    const mockUnsubscribe = jest.fn();
    const mockNavigation = {
      addListener: jest.fn((event, callback) => {
        callback();
        return mockUnsubscribe;
      }),
    };
    renderHook(() => useLockedPortrait(mockNavigation as any));
    expect(mockNavigation.addListener).toHaveBeenCalledWith(
      'focus',
      expect.any(Function),
    );
    expect(ScreenOrientation.lockAsync).toHaveBeenCalledWith(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
    expect(Orientation.removeAllListeners).toHaveBeenCalled();
  });

  it('should return unsubscribe function', () => {
    const mockUnsubscribe = jest.fn();
    const mockNavigation = {
      addListener: jest.fn(() => mockUnsubscribe),
    };
    const {unmount} = renderHook(() => useLockedPortrait(mockNavigation as any));
    expect(mockNavigation.addListener).toHaveBeenCalled();
    unmount();
  });
});
