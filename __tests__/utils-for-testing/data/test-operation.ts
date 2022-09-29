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
  {
    0: 'vote',
    1: {
      permlink: 'https://permlink.hive.com',
      author: testAccount._default.name,
      weight: 100,
    },
  },
  {
    0: 'comment',
    1: {
      permlink: 'https://permlink.hive.com',
      title: 'title_comment',
      body: 'body_comment',
      parent_permlink: 'https://permlink.hive.com/parent',
      parent_author: 'theghost1980',
      json_metadata: JSON.stringify({metadata: 'metadata'}),
    },
  },
] as Operation[];
