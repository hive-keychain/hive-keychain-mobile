import testHas from "__tests__/utils-for-testing/data/test-has";

export default {
    send: jest.spyOn(testHas._default, 'send'),
    registerAccounts: jest.spyOn(testHas._default, 'registerAccounts'),
};