let previousRouteName: string;

export const logScreenView = async (routeName: string) => {
  try {
    if (routeName !== previousRouteName) {
      previousRouteName = routeName;

      routeName = routeName.replace('Screen', '');
      // await analytics().logScreenView({
      //   screen_name: routeName,
      //   screen_class: routeName,
      // });
    }
  } catch (e) {
    console.log('error analytics', e);
  }
};
