import {store} from 'store';

export default {
  dispatch: jest.spyOn(store, 'dispatch'),
  dispatchCb: () => jest.spyOn(store, 'dispatch'),
  dispatchWithoutImplementation: jest
    .spyOn(store, 'dispatch')
    .mockReturnValue(undefined),
};
