import * as NavigationModule from 'utils/navigation';

export default {
  navigate: jest.spyOn(NavigationModule, 'navigate').mockReturnValue(undefined),
  navigateWParams: (executeCallback?: boolean) =>
    jest
      .spyOn(NavigationModule, 'navigate')
      .mockImplementation((routeName: string, params?: any) => {
        if (executeCallback && params.data.callback) {
          params.data.callback();
        }
        if (params.data.onExpire) {
          params.data.onExpire();
        }
        if (params.data.onForceCloseModal) {
          params.data.onForceCloseModal();
        }
      }),
  goBack: jest.spyOn(NavigationModule, 'goBack').mockImplementation(() => {
    return undefined;
  }),
};
