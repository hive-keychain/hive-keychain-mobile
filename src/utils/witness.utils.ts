import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import keychain from 'api/keychain';
import moment from 'moment';
import {WitnessInfo} from 'src/interfaces/witness.interface';
import {WitnessesConfig} from './config';
import {
  fromNaiAndSymbol,
  getAmountFromNai,
  getUSDFromVests,
  nFormatter,
  toFormattedHP,
  toHP,
} from './format';
import {getClient} from './hive';

export const WITNESS_DISABLED_KEY =
  'STM1111111111111111111111111111111114T1Anm';

export const getWitnessInfo = async (
  username: string,
  globalProperties: GlobalProperties,
  currencyPrices: CurrencyPrices,
): Promise<WitnessInfo> => {
  let resultFromAPI: any, resultFromBlockchain;
  [resultFromAPI, resultFromBlockchain] = await Promise.all([
    await keychain.get(`hive/witness/${username}`),
    await getClient().call('database_api', 'find_witnesses', {
      owners: [username],
    }),
  ]);
  resultFromBlockchain = resultFromBlockchain.witnesses[0];

  const lastFeedUpdate = `${resultFromBlockchain.last_hbd_exchange_update}Z`;

  const witnessInfo: WitnessInfo = {
    username: resultFromBlockchain.owner,
    votesCount: resultFromAPI.votes_count,
    voteValueInHP: nFormatter(
      toHP(
        (Number(resultFromAPI.votes) / 1000000).toString(),
        globalProperties.globals,
      ),
      3,
    ),
    blockMissed: resultFromBlockchain.total_missed,
    lastBlock: resultFromBlockchain.last_confirmed_block_num,
    lastBlockUrl: `https://hiveblocks.com/b/${resultFromBlockchain.last_confirmed_block_num}`,
    priceFeed: fromNaiAndSymbol(resultFromBlockchain.hbd_exchange_rate.base),
    priceFeedUpdatedAt: moment(lastFeedUpdate),
    priceFeedUpdatedAtWarning: wasUpdatedAfterThreshold(moment(lastFeedUpdate)),
    signingKey: resultFromBlockchain.signing_key,
    url: resultFromBlockchain.url,
    version: resultFromBlockchain.running_version,
    isDisabled: resultFromBlockchain.signing_key === WITNESS_DISABLED_KEY,
    params: {
      accountCreationFee: getAmountFromNai(
        resultFromBlockchain.props.account_creation_fee,
      ),
      accountCreationFeeFormatted: fromNaiAndSymbol(
        resultFromBlockchain.props.account_creation_fee,
      ),
      maximumBlockSize: resultFromBlockchain.props.maximum_block_size,
      hbdInterestRate: resultFromBlockchain.props.hbd_interest_rate / 100,
    },
    rewards: {
      lastMonthValue: resultFromAPI.lastMonthValue,
      lastMonthInHP: toFormattedHP(
        resultFromAPI.lastMonthValue,
        globalProperties.globals!,
      ),
      lastMonthInUSD: getUSDFromVests(
        resultFromAPI.lastMonthValue,
        globalProperties,
        currencyPrices,
      ),
      lastWeekValue: resultFromAPI.lastWeekValue,
      lastWeekInHP: toFormattedHP(
        resultFromAPI.lastWeekValue,
        globalProperties.globals!,
      ),
      lastWeekInUSD: getUSDFromVests(
        resultFromAPI.lastWeekValue,
        globalProperties,
        currencyPrices,
      ),
      lastYearValue: resultFromAPI.lastYearValue,
      lastYearInHP: toFormattedHP(
        resultFromAPI.lastYearValue,
        globalProperties.globals!,
      ),
      lastYearInUSD: getUSDFromVests(
        resultFromAPI.lastYearValue,
        globalProperties,
        currencyPrices,
      ),
    },
  };
  return witnessInfo;
};
const wasUpdatedAfterThreshold = (updatedAt: moment.Moment) => {
  const now = moment.utc();
  var duration = moment.duration(now.diff(updatedAt.utc()));
  var hours = duration.asHours();

  return hours > WitnessesConfig.feedWarningLimitInHours;
};
