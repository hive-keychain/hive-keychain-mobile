jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
      activeAccount: {name: 'user1'},
      properties: {
        globals: {
          total_vesting_fund_hive: '1000000.000 HIVE',
          total_vesting_shares: '500000000.000000 VESTS',
        },
      },
    })),
    dispatch: jest.fn(),
  },
}));

const mockDatabase = {
  getAccounts: jest.fn(),
};

const mockCall = jest.fn();

const mockClient = {
  database: mockDatabase,
  call: mockCall,
};

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(() => mockClient),
  broadcast: jest.fn(),
  updateProposalVote: jest.fn(),
}));

import ProposalUtils from '../proposals.utils';
import {updateProposalVote} from 'utils/hiveLibs.utils';
import {ActiveAccount} from 'actions/interfaces';

describe('ProposalUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProposalList', () => {
    it('should get proposals', async () => {
      const mockProposals = {
        proposals: [
          {
            id: 1,
            proposal_id: 1,
            creator: 'user1',
            subject: 'Test Proposal',
            daily_pay: {amount: '1000', nai: '@@000000013'},
            permlink: 'test-proposal',
            start_date: '2023-01-01T00:00:00',
            end_date: '2023-12-31T00:00:00',
            total_votes: '1000000',
          },
        ],
      };
      const mockVotes = {
        proposal_votes: [],
      };
      mockCall.mockResolvedValueOnce(mockProposals).mockResolvedValueOnce(mockVotes);
      mockDatabase.getAccounts.mockResolvedValue([{hbd_balance: '1000.000 HBD'}]);
      const result = await ProposalUtils.getProposalList('user1');
      expect(result).toBeDefined();
    });
  });

  describe('voteForKeychainProposal', () => {
    it('should vote on proposal', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {active: 'STM...'},
      };
      (updateProposalVote as jest.Mock).mockResolvedValueOnce({});
      await ProposalUtils.voteForKeychainProposal(
        mockAccount as ActiveAccount,
        1,
        true,
      );
      expect(updateProposalVote).toHaveBeenCalled();
    });
  });
});
