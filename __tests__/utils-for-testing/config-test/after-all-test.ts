export default {
  clearAllMocks: afterAll(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  }),
};
