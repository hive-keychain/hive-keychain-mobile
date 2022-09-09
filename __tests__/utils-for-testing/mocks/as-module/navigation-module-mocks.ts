import * as NavigationModule from 'utils/navigation';

export default {
  navigate: jest.spyOn(NavigationModule, 'navigate').mockReturnValue(undefined),
};
