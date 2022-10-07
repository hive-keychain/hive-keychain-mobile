import testAccount from '__tests__/utils-for-testing/data/test-account';

export default {
  _default: {
    json: {
      list: [testAccount._default],
    },
    pwd: testAccount._default.name,
    encrypted: {
      length: 728,
      containing: '==',
    },
  },
};
