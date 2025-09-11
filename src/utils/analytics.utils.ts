import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {getApp} from '@react-native-firebase/app';

let previousRouteName: string;

export const logScreenView = async (routeName: string) => {
  try {
    if (routeName !== previousRouteName) {
      previousRouteName = routeName;

      routeName = routeName.replace('Screen', '');
      const app = getApp();
      const analytics = getAnalytics(app);

      await logEvent(analytics, 'screen_view' as any, {
        screen_name: routeName,
        screen_class: routeName,
      });
    }
  } catch (e) {
    console.log('error analytics', e);
  }
};
