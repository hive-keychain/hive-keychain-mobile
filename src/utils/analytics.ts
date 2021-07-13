import analytics from '@react-native-firebase/analytics';

let previousRouteName: string;
let lastWalletPage = 'WalletScreen';

export const logScreenView = async (routeName: string) => {
  if (routeName !== previousRouteName) {
    previousRouteName = routeName;

    routeName = routeName.replace('Screen', '');
    console.log(`Logging route : ${routeName}`);

    await analytics().logScreenView({
      screen_name: routeName,
      screen_class: routeName,
    });
  }
};
