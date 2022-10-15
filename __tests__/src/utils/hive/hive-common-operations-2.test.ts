import {
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  CommentOptionsOperation,
  CreateClaimedAccountOperation,
  Operation,
  UpdateProposalVotesOperation,
  VoteOperation,
} from '@hiveio/dhive';
import {
  createClaimedAccount,
  post,
  setProxy,
  updateProposalVote,
  vote,
  voteForWitness,
} from 'utils/hive';
import {RequestPost} from 'utils/keychain.types';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testRequest from '__tests__/utils-for-testing/data/test-request';
import method from '__tests__/utils-for-testing/helpers/method';
import objects from '__tests__/utils-for-testing/helpers/objects';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/common operation cases part 2:\n', () => {
  const {sucess: successResponse} = testBroadcastResponse;
  const {active: activeKey} = testAccount._default.keys;
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  beforeEach(() => {
    hiveUtilsMocks.broadcast(successResponse);
  });
  it('Must call broadcast on successful vote', async () => {
    const operation = method.getTestOperation('vote') as VoteOperation;
    const {[1]: voteOpData} = operation;
    expect(await vote(activeKey, voteOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['vote', voteOpData],
    ]);
  });

  it('Must call broadcast on successful witness vote', async () => {
    const operation = method.getTestOperation(
      'account_witness_vote',
    ) as AccountWitnessVoteOperation;
    const {[1]: voteForWitnessOpData} = operation;
    expect(await voteForWitness(activeKey, voteForWitnessOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['account_witness_vote', voteForWitnessOpData],
    ]);
  });

  it('Must call broadcast on successful set proxy', async () => {
    const operation = method.getTestOperation(
      'account_witness_proxy',
    ) as AccountWitnessProxyOperation;
    const {[1]: setProxyOpData} = operation;
    expect(await setProxy(activeKey, setProxyOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['account_witness_proxy', setProxyOpData],
    ]);
  });

  it('Must call broadcast on successful created claimed account', async () => {
    const operation = method.getTestOperation(
      'create_claimed_account',
    ) as CreateClaimedAccountOperation;
    const {[1]: createClaimedAccountOpData} = operation;
    expect(
      await createClaimedAccount(activeKey, createClaimedAccountOpData),
    ).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['create_claimed_account', createClaimedAccountOpData],
    ]);
  });

  it('Must call broadcast on successful post with comment options', async () => {
    const requestPost = testRequest.post;
    expect(await post(activeKey, requestPost)).toBe(successResponse);
    const {
      comment_options,
      username,
      parent_perm,
      parent_username,
      ...data
    } = requestPost;
    const arr: Operation[] = [
      [
        'comment',
        {
          ...data,
          author: username,
          parent_permlink: parent_perm,
          parent_author: parent_username,
        },
      ],
    ];
    arr.push([
      'comment_options',
      JSON.parse(comment_options) as CommentOptionsOperation[1],
    ]);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, arr);
  });

  it('Must call broadcast on successful post without comment options', async () => {
    const cloneRequestPost = objects.cloneAndRemoveObjProperties(
      testRequest.post,
      ['comment_options'],
    ) as RequestPost;
    expect(await post(activeKey, cloneRequestPost)).toBe(successResponse);
    const {
      comment_options,
      username,
      parent_perm,
      parent_username,
      ...data
    } = cloneRequestPost;
    const arr: Operation[] = [
      [
        'comment',
        {
          ...data,
          author: username,
          parent_permlink: parent_perm,
          parent_author: parent_username,
        },
      ],
    ];
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, arr);
  });

  it('Must call broadcast on successful update proposal vote', async () => {
    const operation = method.getTestOperation(
      'update_proposal_votes',
    ) as UpdateProposalVotesOperation;
    const {[1]: updateProposalVoteOpData} = operation;
    expect(await updateProposalVote(activeKey, updateProposalVoteOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['update_proposal_votes', updateProposalVoteOpData],
    ]);
  });
});
