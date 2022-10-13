import {ExtendedAccount} from '@hiveio/dhive';
import ProposalUtils from 'utils/proposals';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testDynamicGlobalProperties from '__tests__/utils-for-testing/data/test-dynamic-global-properties';
import {emptyStateStore} from '__tests__/utils-for-testing/data/test-initial-state';
import testProposals from '__tests__/utils-for-testing/data/test-proposals';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import storeMock from '__tests__/utils-for-testing/mocks/store-mock';
afterAllTest.clearAllMocks;
describe('proposals tests:\n', () => {
  describe('getProposalList cases:\n', () => {
    it('Must return a proposal list filtered & ordered by votes', async () => {
      storeMock.getState({
        ...emptyStateStore,
        properties: {globals: testDynamicGlobalProperties},
      });
      hiveUtilsMocks.getClient.call.database_api.list_proposals(
        testProposals.hiveProposalsResponse,
      );
      hiveUtilsMocks.getClient.call.database_api.list_proposal_votes(
        testProposals.proposalVotes,
      );
      hiveUtilsMocks.getClient.database.getAccounts({
        hbd_balance: '16259983.208 HBD',
      } as ExtendedAccount);
      expect(
        await ProposalUtils.getProposalList(testAccount._default.name),
      ).toEqual(testProposals.proposalList);
    });
  });
});
