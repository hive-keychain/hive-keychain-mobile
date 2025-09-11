import {Asset, DynamicGlobalProperties} from '@hiveio/dhive';
import moment from 'moment';
import {Key} from 'src/interfaces/keys.interface';
import {RootState, store} from 'store';
import {ProposalConfig} from './config.utils';
import {getSymbol, nFormatter, toHP} from './format.utils';
import {getClient, getData, updateProposalVote} from './hiveLibs.utils';

export enum FundedOption {
  TOTALLY_FUNDED = 'totally_funded',
  PARTIALLY_FUNDED = 'partially_funded',
  NOT_FUNDED = 'not_funded',
}
export interface Proposal {
  id: number;
  creator: string;
  dailyPay: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  receiver: string;
  status: string;
  totalVotes: string;
  subject: string;
  link: string;
  proposalId: number;
  voted: boolean;
  funded: FundedOption;
}

const getProposalList = async (accountName: string) => {
  const result = await getClient().call('database_api', 'list_proposals', {
    start: [-1],
    limit: 1000,
    order: 'by_total_votes',
    order_direction: 'descending',
    status: 'votable',
  });

  const listProposalVotes = (
    await getClient().call('database_api', 'list_proposal_votes', {
      start: [accountName],
      limit: 1000,
      order: 'by_voter_proposal',
      order_direction: 'descending',
      status: 'votable',
    })
  ).proposal_votes
    .filter((item: any) => item.voter === accountName)
    .map((item: any) => item.proposal);

  let dailyBudget =
    parseFloat(
      (await getClient().database.getAccounts(['hive.fund']))[0].hbd_balance
        .toString()
        .split(' ')[0],
    ) / 100;
  return result.proposals.map((proposal: any) => {
    let fundedOption = FundedOption.NOT_FUNDED;
    if (dailyBudget > 0) {
      if (dailyBudget - parseFloat(proposal.daily_pay.amount) / 1000 >= 0) {
        fundedOption = FundedOption.TOTALLY_FUNDED;
      } else {
        fundedOption = FundedOption.PARTIALLY_FUNDED;
      }
    }

    dailyBudget = dailyBudget - parseFloat(proposal.daily_pay.amount) / 1000;
    return {
      id: proposal.id,
      creator: proposal.creator,
      proposalId: proposal.proposal_id,
      subject: proposal.subject,
      receiver: proposal.receiver,
      dailyPay: `${parseFloat(proposal.daily_pay.amount) / 1000} ${getSymbol(
        proposal.daily_pay.nai,
      )}`,
      link: `https://peakd.com/proposals/${proposal.proposal_id}`,
      startDate: moment(proposal.start_date),
      endDate: moment(proposal.end_date),
      totalVotes: `${nFormatter(
        toHP(
          (parseFloat(proposal.total_votes) / 1000000).toString(),
          (store.getState() as RootState).properties.globals,
        ),
        2,
      )} HP`,
      voted:
        listProposalVotes.find(
          (p: any) => p.proposal_id === proposal.proposal_id,
        ) !== undefined,
      funded: fundedOption,
    } as Proposal;
  });
};
const getProposalDailyBudget = async () => {
  return (
    parseFloat(
      (await getClient().database.getAccounts(['hive.fund']))[0].hbd_balance
        .toString()
        .split(' ')[0],
    ) / 100
  );
};

const isRequestingProposalVotes = async (globals: DynamicGlobalProperties) => {
  let dailyBudget = +(await getProposalDailyBudget());
  const proposals = (
    await getData('condenser_api.list_proposals', [
      [-1],
      1000,
      'by_total_votes',
      'descending',
      'votable',
    ])
  ).map((proposal: any) => {
    const dailyPay = Asset.fromString(proposal.daily_pay);
    let fundedOption = FundedOption.NOT_FUNDED;
    if (dailyBudget > 0) {
      dailyBudget -= dailyPay.amount;
      if (dailyBudget >= 0) {
        fundedOption = FundedOption.TOTALLY_FUNDED;
      } else {
        fundedOption = FundedOption.PARTIALLY_FUNDED;
      }
    }
    proposal.fundedOption = fundedOption;
    proposal.totalVotes = toHP(
      (parseFloat(proposal.total_votes) / 1000000).toString(),
      globals,
    );
    return proposal;
  });

  const keychainProposal = proposals.find(
    (proposal: any) => proposal.id === ProposalConfig.KEYCHAIN_PROPOSAL,
  );
  const returnProposal = proposals.find(
    (proposal: any) => proposal.fundedOption == FundedOption.PARTIALLY_FUNDED,
  );

  const voteDifference =
    keychainProposal.totalVotes - returnProposal.totalVotes;

  return (
    voteDifference < ProposalConfig.PROPOSAL_MIN_VOTE_DIFFERENCE_HIDE_POPUP
  );
};

const hasVotedForProposal = async (
  username: string,
  proposalId?: number,
): Promise<boolean> => {
  const listProposalVotes = await getData('condenser_api.list_proposal_votes', [
    [
      proposalId !== undefined ? proposalId : ProposalConfig.KEYCHAIN_PROPOSAL,
      username,
    ],
    1,
    'by_proposal_voter',
    'ascending',
    'all',
  ]);
  return listProposalVotes[0].voter === username;
};

const voteForKeychainProposal = async (username: string, activeKey: Key) => {
  return await updateProposalVote(activeKey, {
    voter: username,
    proposal_ids: [ProposalConfig.KEYCHAIN_PROPOSAL],
    approve: true,
    extensions: [],
  });
};

const ProposalUtils = {
  getProposalList,
  isRequestingProposalVotes,
  hasVotedForProposal,
  voteForKeychainProposal,
};

export default ProposalUtils;
