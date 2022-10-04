import {
  AccountCreateOperation,
  AccountCreateWithDelegationOperation,
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  Asset,
  CommentOperation,
  DelegateVestingSharesOperation,
  Operation,
  PowOperation,
  RecurrentTransferOperation,
  TransferOperation,
  VoteOperation,
} from '@hiveio/dhive';
import {KeychainKeyTypesLC, KeychainRequestTypes} from 'utils/keychain.types';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testAuthorityType from './test-authority-type';

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
  } as VoteOperation,
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
  } as CommentOperation,
  {
    0: 'transfer',
    1: {
      from: testAccount._default.name,
      to: 'theghost1980',
      amount: '10000 HIVE',
      memo: '',
    },
  } as TransferOperation,
  {
    0: 'delegate_vesting_shares',
    1: {
      delegator: testAccount._default.name,
      delegatee: 'theghost1980',
      vesting_shares: '100000000 HP',
    },
  } as DelegateVestingSharesOperation,
  {
    0: 'account_witness_vote',
    1: {
      account: testAccount._default.name,
      witness: 'theghost1980',
      approve: true,
    },
  } as AccountWitnessVoteOperation,
  {
    0: 'account_witness_proxy',
    1: {
      account: testAccount._default.name,
      proxy: 'keychain',
      type: KeychainRequestTypes.proxy,
    },
  } as AccountWitnessProxyOperation,
  {
    0: 'account_create_with_delegation',
    1: {
      fee: '1 HIVE',
      delegation: 'delegation',
      creator: testAccount._default.name,
      new_account_name: 'theghost1981',
      owner: testAuthorityType._default.emptyAuth,
      active: testAuthorityType._default.emptyAuth,
      posting: testAuthorityType._default.emptyAuth,
      memo_key: testAccount._default.keys.memoPubkey,
      json_metadata: JSON.stringify({metadata: 'metadata'}),
      extensions: [],
    },
  } as AccountCreateWithDelegationOperation,
  {
    0: 'recurrent_transfer',
    1: {
      from: testAccount._default.name,
      to: 'quentin',
      amount: '100000 HIVE',
      memo: '',
      recurrence: 1,
      executions: 2,
      extensions: [],
    },
  } as RecurrentTransferOperation,
] as Operation[];
