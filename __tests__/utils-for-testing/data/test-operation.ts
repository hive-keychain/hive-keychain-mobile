import {Operation} from '@hiveio/dhive';
import testAccount from '__tests__/utils-for-testing/data/test-account';

export default [
  {
    0: 'account_create',
    1: {
      permlink: 'https://permlink.hive.com',
      author: testAccount._default.name,
      weight: 100,
    },
  },
] as Operation[];
