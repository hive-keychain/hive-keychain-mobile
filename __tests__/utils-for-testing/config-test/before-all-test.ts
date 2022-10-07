const mockStore = beforeAll(() => {
  jest.mock('store', () => {
    return {
      getState: jest.fn().mockResolvedValue(['hi']),
    };
  });
});

const useFakeTimers = (setTimeout?: number) => {
  jest.useFakeTimers('legacy');
  if (setTimeout) jest.setTimeout(setTimeout);
};

export default {
  mockStore,
  useFakeTimers,
};
