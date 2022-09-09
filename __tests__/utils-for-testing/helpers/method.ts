const clearSpies = (spies: jest.SpyInstance[]) => {
  spies.forEach((spy) => spy.mockClear());
};

export default {clearSpies};
