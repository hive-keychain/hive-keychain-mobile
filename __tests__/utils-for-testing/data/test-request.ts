import {KeychainRequestTypes, RequestPost} from 'utils/keychain.types';
import testAccount from './test-account';
import testCommentOptions from './test-comment-options';

export default {
  post: {
    type: KeychainRequestTypes.post,
    username: testAccount._default.name,
    title: 'Amazing Post',
    body: 'body post',
    parent_perm: 'https://hive.blog/@theghost1980/amazing-post',
    parent_username: testAccount._default.name,
    json_metadata: JSON.stringify({meta: 'data'}),
    permlink: 'https://hive.blog/@theghost1980/amazing-post',
    comment_options: JSON.stringify(testCommentOptions._default),
  } as RequestPost,
};
