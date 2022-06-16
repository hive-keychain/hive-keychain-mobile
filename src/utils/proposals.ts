import moment from 'moment';
import {RootState, store} from 'store';
import {getSymbol, nFormatter, toHP} from './format';
import {getClient} from './hive';

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

const ProposalUtils = {
  getProposalList,
};

export default ProposalUtils;
