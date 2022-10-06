import {
  ClaimRewardBalanceOperation,
  CreateProposalOperation,
  RemoveProposalOperation,
} from '@hiveio/dhive';
import {claimRewards, createProposal, removeProposal} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import method from '__tests__/utils-for-testing/helpers/method';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/common operation cases part 3:\n', () => {
  const {sucess: successResponse} = testBroadcastResponse;
  const {active: activeKey} = testAccount._default.keys;
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  beforeEach(() => {
    hiveUtilsMocks.broadcast(successResponse);
  });
  it('Must call broadcast on successful create proposal', async () => {
    const operation = method.getTestOperation(
      'create_proposal',
    ) as CreateProposalOperation;
    const {[1]: createProposalOpData} = operation;
    expect(await createProposal(activeKey, createProposalOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['create_proposal', createProposalOpData],
    ]);
  });

  it('Must call broadcast on successful claim rewards', async () => {
    const operation = method.getTestOperation(
      'claim_reward_balance',
    ) as ClaimRewardBalanceOperation;
    const {[1]: claimRewardOpData} = operation;
    expect(await claimRewards(activeKey, claimRewardOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['claim_reward_balance', claimRewardOpData],
    ]);
  });

  it('Must call broadcast on successful remove proposal', async () => {
    const operation = method.getTestOperation(
      'remove_proposal',
    ) as RemoveProposalOperation;
    const {[1]: removeProposalOpData} = operation;
    expect(await removeProposal(activeKey, removeProposalOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['remove_proposal', removeProposalOpData],
    ]);
  });
});
