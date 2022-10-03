import {store} from 'store';

const mockStore = beforeAll(() => {
  jest.mock('store', () => {
    return {
      getState: jest.fn().mockResolvedValue(['hi']),
    };
  });
});

export default {
  mockStore,
};
