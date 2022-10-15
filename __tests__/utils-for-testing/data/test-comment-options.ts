import {CommentOptionsOperation} from '@hiveio/dhive';
import testAccount from './test-account';

export default {
  _default: {
    0: 'comment_options',
    1: {
      author: testAccount._default.name,
      permlink: 'https://hive.blog/@theghost1980/amazing-post',
      max_accepted_payout: '10000 HBD',
      percent_hbd: 100,
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [],
    },
  } as CommentOptionsOperation,
};
