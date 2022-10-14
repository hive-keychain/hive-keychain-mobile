import {store} from 'store';
import {RootState} from '__tests__/utils-for-testing/store/fake-store';

export default {
  dispatch: {
    WithNoImplementation: store.dispatch = jest.fn(),
    omit: jest
      .spyOn(store, 'dispatch')
      .mockImplementation((...args) => undefined),
  },
  getState: (state: RootState) =>
    (store.getState = jest.fn().mockReturnValue(state)),
};
