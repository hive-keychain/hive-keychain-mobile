import {store} from 'store';
//TODO check if really needed for now to check the dispatch
// if needed find a better way to spy on it while using it
// so it won't mess up with any of its functions.
export default {
  dispatch: jest.spyOn(store, 'dispatch'),
  dispatchCb: () => jest.spyOn(store, 'dispatch'),
  dispatchWithoutImplementation: jest
    .spyOn(store, 'dispatch')
    .mockReturnValue(undefined),
};
