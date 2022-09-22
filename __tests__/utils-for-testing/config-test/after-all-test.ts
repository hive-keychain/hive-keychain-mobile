export default {
  clearAllMocks: afterAll(() => {
    jest.clearAllMocks();
    //jest.resetModules();
  }),
};
