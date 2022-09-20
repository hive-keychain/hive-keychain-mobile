export default {
  clearAllMocks: afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  }),
};
