import {WitnessUpdateOperation} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import keychain from 'api/keychain';
import moment from 'moment';
import {Key} from 'src/interfaces/keys.interface';
import {
  LastSigningKeys,
  WitnessInfo,
  WitnessParamsForm,
} from 'src/interfaces/witness.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {WitnessesConfig} from './config';
import {
  fromNaiAndSymbol,
  getAmountFromNai,
  getUSDFromVests,
  nFormatter,
  toFormattedHP,
  toHP,
} from './format';
import {broadcast, getClient} from './hive';

export const MAX_WITNESS_VOTE = 30;

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
    votesCount: resultFromAPI.data.votes_count,
    voteValueInHP: nFormatter(
      toHP(
        (Number(resultFromAPI.data.votes) / 1000000).toString(),
        globalProperties.globals,
      ),
      3,
    ),
    blockMissed: resultFromBlockchain.total_missed || 0,
    lastBlock: resultFromBlockchain.last_confirmed_block_num || 0,
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
      lastMonthValue: resultFromAPI.data.lastMonthValue || 0,
      lastMonthInHP: toFormattedHP(
        resultFromAPI.data.lastMonthValue || 0,
        globalProperties.globals!,
      ),
      lastMonthInUSD: getUSDFromVests(
        resultFromAPI.data.lastMonthValue || 0,
        globalProperties,
        currencyPrices,
      ),
      lastWeekValue: resultFromAPI.data.lastWeekValue || 0,
      lastWeekInHP: toFormattedHP(
        resultFromAPI.data.lastWeekValue || 0,
        globalProperties.globals!,
      ),
      lastWeekInUSD: getUSDFromVests(
        resultFromAPI.data.lastWeekValue || 0,
        globalProperties,
        currencyPrices,
      ),
      lastYearValue: resultFromAPI.data.lastYearValue || 0,
      lastYearInHP: toFormattedHP(
        resultFromAPI.data.lastYearValue || 0,
        globalProperties.globals!,
      ),
      lastYearInUSD: getUSDFromVests(
        resultFromAPI.data.lastYearValue || 0,
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

export const saveLastSigningKeyForWitness = async (
  username: string,
  key: string,
) => {
  let result: LastSigningKeys = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.WITNESS_LAST_SIGNING_KEY),
  );
  if (!result) {
    result = {};
  }
  result[username] = key;
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.WITNESS_LAST_SIGNING_KEY,
    JSON.stringify(result),
  );
};

export const getLastSigningKeyForWitness = async (username: string) => {
  const result: LastSigningKeys = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.WITNESS_LAST_SIGNING_KEY),
  );
  return result ? result[username] : null;
};

export const updateWitnessParameters = async (
  witnessAccountName: string,
  witnessParamsForm: WitnessParamsForm,
  activeKey: Key,
) => {
  return await broadcast(activeKey, [
    [
      'witness_update',
      {
        owner: witnessAccountName,
        url: witnessParamsForm.url,
        block_signing_key: witnessParamsForm.signingKey,
        props: {
          account_creation_fee: `${Number(
            witnessParamsForm.accountCreationFee,
          ).toFixed(3)} HIVE`,
          maximum_block_size: Number(witnessParamsForm.maximumBlockSize),
          hbd_interest_rate: Number(witnessParamsForm.hbdInterestRate) * 100,
        },
        fee: '0.000 HIVE',
      },
    ] as WitnessUpdateOperation,
  ]);
};
