import * as NavigationModule from 'utils/navigation';

export default {
  navigate: jest.spyOn(NavigationModule, 'navigate').mockReturnValue(undefined),
  navigateWParams: jest
    .spyOn(NavigationModule, 'navigate')
    .mockImplementation((routeName: string, params?: any) => {
      if (params.data.onExpire) {
        params.data.onExpire();
      }
      if (params.data.onForceCloseModal) {
        params.data.onForceCloseModal();
      }
    }),
};
