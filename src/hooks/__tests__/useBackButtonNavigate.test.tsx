import {renderHook} from '@testing-library/react-native';
import {useBackButtonNavigation} from '../useBackButtonNavigate';
import {BackHandler} from 'react-native';
import {resetStackAndNavigate} from 'utils/navigation.utils';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

jest.mock('utils/navigation.utils', () => ({
  resetStackAndNavigate: jest.fn(),
}));

describe('useBackButtonNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set up back button handler', () => {
    renderHook(() => useBackButtonNavigation('Home'));
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });

  it('should navigate when back button pressed', () => {
    let onBackPress: () => boolean;
    (BackHandler.addEventListener as jest.Mock).mockImplementation(
      (event, handler) => {
        onBackPress = handler;
        return {remove: jest.fn()};
      },
    );
    renderHook(() => useBackButtonNavigation('Home'));
    onBackPress!();
    expect(resetStackAndNavigate).toHaveBeenCalledWith('Home');
  });

  it('should skip navigation when skipNavigation is true', () => {
    let onBackPress: () => boolean;
    (BackHandler.addEventListener as jest.Mock).mockImplementation(
      (event, handler) => {
        onBackPress = handler;
        return {remove: jest.fn()};
      },
    );
    renderHook(() => useBackButtonNavigation('Home', true));
    onBackPress!();
    expect(resetStackAndNavigate).not.toHaveBeenCalled();
  });
});
