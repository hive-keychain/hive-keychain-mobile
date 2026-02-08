import {logScreenView} from '../analytics.utils';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {getApp} from '@react-native-firebase/app';

jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(),
}));

describe('analytics.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logScreenView', () => {
    it('should log screen view', async () => {
      const mockApp = {};
      const mockAnalytics = {};
      (getApp as jest.Mock).mockReturnValue(mockApp);
      (getAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
      (logEvent as jest.Mock).mockResolvedValueOnce(undefined);

      await logScreenView('TestScreen');

      expect(getApp).toHaveBeenCalled();
      expect(getAnalytics).toHaveBeenCalledWith(mockApp);
      expect(logEvent).toHaveBeenCalledWith(mockAnalytics, 'screen_view', {
        screen_name: 'Test',
        screen_class: 'Test',
      });
    });

    it('should log different screen views', async () => {
      const mockApp = {};
      const mockAnalytics = {};
      (getApp as jest.Mock).mockReturnValue(mockApp);
      (getAnalytics as jest.Mock).mockReturnValue(mockAnalytics);

      await logScreenView('FirstScreen');
      await logScreenView('SecondScreen'); // Different screen

      expect(logEvent).toHaveBeenCalledTimes(2);
    });

    it('should handle errors gracefully', async () => {
      const mockApp = {};
      const mockAnalytics = {};
      (getApp as jest.Mock).mockReturnValue(mockApp);
      (getAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
      (logEvent as jest.Mock).mockRejectedValueOnce(new Error('Analytics error'));

      await expect(logScreenView('TestScreen')).resolves.not.toThrow();
    });
  });
});
