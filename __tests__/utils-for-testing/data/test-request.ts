import {
  KeychainKeyTypes,
  KeychainRequestData,
  KeychainRequestTypes,
  RequestAddAccountAuthority,
  RequestAddKeyAuthority,
  RequestDecode,
  RequestError,
  RequestPost,
  RequestRemoveAccountAuthority,
  RequestRemoveKeyAuthority,
  RequestSuccess,
  RequestWitnessVote,
} from 'utils/keychain.types';
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
  addaccountAuth: {
    type: KeychainRequestTypes.addAccountAuthority,
    authorizedUsername: 'quentin',
    role: KeychainKeyTypes.active,
    weight: 0,
    username: testAccount._default.name,
    method: KeychainKeyTypes.active,
  } as RequestAddAccountAuthority,
  removeAccountAuth: {
    username: testAccount._default.name,
    authorizedUsername: 'quentin',
    role: KeychainKeyTypes.active,
  } as RequestRemoveAccountAuthority,
  addKeyAuthority: {
    username: testAccount._default.name,
    authorizedKey: testAccount._default.keys.activePubkey,
    role: KeychainKeyTypes.active,
    weight: 1,
  } as RequestAddKeyAuthority,
  removeKeyAuthority: {
    username: testAccount._default.name,
    authorizedKey: testAccount._default.keys.activePubkey,
    role: KeychainKeyTypes.active,
  } as RequestRemoveKeyAuthority,
  witnessVote: {
    type: KeychainRequestTypes.witnessVote,
    witness: 'keychain',
    vote: true,
  } as RequestWitnessVote,
  error: (requestData: KeychainRequestData): RequestError => {
    return {
      data: requestData,
      request_id: 10001,
      error: 'error',
      message: 'error_message',
    };
  },
  success: (requestData: KeychainRequestData): RequestSuccess => {
    return {
      data: requestData,
      request_id: 10002,
      result: 'success',
      message: 'success_message',
    };
  },
  decode: {
    type: KeychainRequestTypes.decode,
    username: testAccount._default.name,
    message: 'message',
    method: KeychainKeyTypes.memo,
  } as RequestDecode,
};
