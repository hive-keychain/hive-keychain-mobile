jest.unmock('../navigation.utils');
jest.mock('@react-navigation/stack', () => ({
  CardStyleInterpolators: {
    forHorizontalIOS: jest.fn(),
  },
  HeaderStyleInterpolators: {
    forUIKit: jest.fn(),
  },
}));

jest.mock('react-native-gesture-handler', () => ({}));

import * as navigationUtils from '../navigation.utils';
import {CommonActions} from '@react-navigation/native';

describe('navigation.utils', () => {
  const mockNavigator = {
    isReady: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
    dispatch: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    navigationUtils.setNavigator(mockNavigator as any);
    mockNavigator.isReady.mockReturnValue(true);
    mockNavigator.canGoBack.mockReturnValue(true);
  });

  afterEach(() => {
    navigationUtils.setNavigator(null);
  });

  describe('navigate', () => {
    it('should navigate when navigator is ready', () => {
      navigationUtils.navigate('Home', {param: 'value'});
      expect(mockNavigator.dispatch).toHaveBeenCalledWith(
        CommonActions.navigate({name: 'Home', params: {param: 'value'}}),
      );
    });

    it('should not navigate when navigator is not ready', () => {
      mockNavigator.isReady.mockReturnValue(false);
      navigationUtils.navigate('Home');
      expect(mockNavigator.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('should go back when navigator is ready and can go back', () => {
      navigationUtils.goBack();
      expect(mockNavigator.goBack).toHaveBeenCalled();
    });

    it('should not go back when navigator cannot go back', () => {
      mockNavigator.canGoBack.mockReturnValue(false);
      navigationUtils.goBack();
      expect(mockNavigator.goBack).not.toHaveBeenCalled();
    });
  });

  describe('goBackAndNavigate', () => {
    it('should go back and navigate', () => {
      navigationUtils.goBackAndNavigate('Home');
      expect(mockNavigator.goBack).toHaveBeenCalled();
      expect(mockNavigator.dispatch).toHaveBeenCalled();
    });
  });

  describe('resetStackAndNavigate', () => {
    it('should reset stack and navigate to non-Wallet screen', () => {
      navigationUtils.resetStackAndNavigate('Settings');
      expect(mockNavigator.dispatch).toHaveBeenCalled();
    });

    it('should navigate to Wallet screen differently', () => {
      navigationUtils.resetStackAndNavigate('Wallet');
      expect(mockNavigator.dispatch).toHaveBeenCalled();
    });
  });
});
