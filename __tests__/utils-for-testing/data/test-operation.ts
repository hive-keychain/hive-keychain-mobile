import {
  AccountCreateWithDelegationOperation,
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  ClaimRewardBalanceOperation,
  CollateralizedConvertOperation,
  CommentOperation,
  ConvertOperation,
  CreateClaimedAccountOperation,
  CreateProposalOperation,
  DelegateVestingSharesOperation,
  Operation,
  RecurrentTransferOperation,
  RemoveProposalOperation,
  TransferFromSavingsOperation,
  TransferOperation,
  TransferToSavingsOperation,
  TransferToVestingOperation,
  UpdateProposalVotesOperation,
  VoteOperation,
  WithdrawVestingOperation,
} from '@hiveio/dhive';
import {KeychainRequestTypes} from 'utils/keychain.types';
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
  {
    0: 'transfer_to_vesting',
    1: {
      from: testAccount._default.name,
      to: 'theghost1980',
      amount: '1000000 HIVE',
    },
  } as TransferToVestingOperation,
  {
    0: 'withdraw_vesting',
    1: {
      account: testAccount._default.name,
      vesting_shares: '1000000 HIVE',
    },
  } as WithdrawVestingOperation,
  {
    0: 'convert',
    1: {
      owner: testAccount._default.name,
      requestid: 1000,
      amount: '10000 HIVE',
    },
  } as ConvertOperation,
  {
    0: 'collateralized_convert',
    1: {
      owner: testAccount._default.name,
      requestid: 1001,
      amount: '10000 HBD',
    },
  } as CollateralizedConvertOperation,
  {
    0: 'transfer_to_savings',
    1: {
      amount: '10000 HBD',
      from: testAccount._default.name,
      memo: 'memo transferring to savings',
      request_id: 1002,
      to: testAccount._default.name,
    },
  } as TransferToSavingsOperation,
  {
    0: 'transfer_from_savings',
    1: {
      amount: '1000 HBD',
      from: testAccount._default.name,
      memo: 'memo transferring from savings',
      request_id: 1002,
      to: testAccount._default.name,
    },
  } as TransferFromSavingsOperation,
  {
    0: 'vote',
    1: {
      voter: testAccount._default.name,
      author: 'theghost1980',
      permlink: 'https://hive.blog/@theghost1980/the-best-post/',
    },
  } as VoteOperation,
  {
    0: 'create_claimed_account',
    1: {
      creator: testAccount._default.name,
      new_account_name: testAccount._default.name + '_1',
      owner: testAuthorityType._default.emptyAuth,
      active: testAuthorityType._default.emptyAuth,
      posting: testAuthorityType._default.emptyAuth,
      memo_key: testAccount._default.keys.memoPubkey,
      json_metadata: JSON.stringify({meta: 'data'}),
      /**
       * Extensions. Not currently used.
       */
      extensions: [],
    },
  } as CreateClaimedAccountOperation,
  {
    0: 'update_proposal_votes',
    1: {
      voter: testAccount._default.name,
      proposal_ids: [216],
      approve: true,
      extensions: [],
    },
  } as UpdateProposalVotesOperation,
  {
    0: 'create_proposal',
    1: {
      creator: 'keychain',
      receiver: 'keychain',
      start_date: '05/15/2022',
      end_date: '05/15/2023',
      daily_pay: '391 HBD',
      subject: 'Hive Keychain development',
      permlink:
        'https://peakd.com/hive/@keychain/hive-keychain-proposal-dhf-ran717',
      extensions: [],
    },
  } as CreateProposalOperation,
  {
    0: 'claim_reward_balance',
    1: {
      account: testAccount._default.name,
      reward_hive: '1000 HIVE',
      reward_hbd: '1000 HBD',
      reward_vests: '1000 VESTS',
    },
  } as ClaimRewardBalanceOperation,
  {
    0: 'remove_proposal',
    1: {
      proposal_owner: 'keychain',
      proposal_ids: [216],
      extensions: [],
    },
  } as RemoveProposalOperation,
] as Operation[];
