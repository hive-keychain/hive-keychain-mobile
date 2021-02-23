import {getClient} from './dhive';
import api from 'api/keychain';

const HIVE_VOTING_MANA_REGENERATION_SECONDS = 432000;
const HIVE_100_PERCENT = 10000;

export const getVP = (account) => {
  if (!account.name) {
    return null;
  }
  const estimated_max = getEffectiveVestingSharesPerAccount(account) * 1000000;
  const current_mana = parseFloat(account.voting_manabar.current_mana);
  const last_update_time = account.voting_manabar.last_update_time;
  const diff_in_seconds = Math.round(Date.now() / 1000 - last_update_time);
  let estimated_mana =
    current_mana +
    (diff_in_seconds * estimated_max) / HIVE_VOTING_MANA_REGENERATION_SECONDS;
  if (estimated_mana > estimated_max) {
    estimated_mana = estimated_max;
  }
  const estimated_pct = (estimated_mana / estimated_max) * 100;
  return estimated_pct;
};

const getEffectiveVestingSharesPerAccount = (account) => {
  const effective_vesting_shares =
    parseFloat(account.vesting_shares.replace(' VESTS', '')) +
    parseFloat(account.received_vesting_shares.replace(' VESTS', '')) -
    parseFloat(account.delegated_vesting_shares.replace(' VESTS', ''));
  return effective_vesting_shares;
};

export const getVotingDollarsPerAccount = (
  voteWeight,
  properties,
  account,
  full,
) => {
  if (!properties.globals || !account.name) {
    return null;
  }
  const vp = getVP(account) * 100;
  const rewardBalance = getRewardBalance(properties);
  const recentClaims = getRecentClaims(properties);
  const hivePrice = getHivePrice(properties);
  const votePowerReserveRate = getVotePowerReserveRate(properties);

  if (rewardBalance && recentClaims && hivePrice && votePowerReserveRate) {
    const effective_vesting_shares = Math.round(
      getEffectiveVestingSharesPerAccount(account) * 1000000,
    );
    const current_power = full ? 10000 : vp;
    const weight = voteWeight * 100;

    const max_vote_denom =
      (votePowerReserveRate * HIVE_VOTING_MANA_REGENERATION_SECONDS) /
      (60 * 60 * 24);
    let used_power = Math.round((current_power * weight) / HIVE_100_PERCENT);
    used_power = Math.round((used_power + max_vote_denom - 1) / max_vote_denom);
    const rshares = Math.round(
      (effective_vesting_shares * used_power) / HIVE_100_PERCENT,
    );
    const voteValue = ((rshares * rewardBalance) / recentClaims) * hivePrice;
    return isNaN(voteValue) ? '0' : voteValue.toFixed(2);
  } else {
    return;
  }
};
export const getRC = async (account) => {
  const rc = await getClient().rc.calculateRCMana(account.name);
  return rc;
};

const getRewardBalance = (properties) => {
  return parseFloat(properties.rewardFund.reward_balance);
};

const getRecentClaims = (properties) => {
  return parseInt(properties.rewardFund.recent_claims, 10);
};

const getHivePrice = (properties) => {
  return parseFloat(properties.price.base) / parseFloat(properties.price.quote);
};

const getVotePowerReserveRate = (properties) => {
  return properties.globals.vote_power_reserve_rate;
};

export const getDelegators = async (name) => {
  return (await api.get(`/hive/delegators/${name}`)).data
    .filter((e) => e.vesting_shares !== 0)
    .sort((a, b) => b.vesting_shares - a.vesting_shares);
};

export const getDelegatees = async (name) => {
  return (await getClient().database.getVestingDelegations(name, '', 1000))
    .filter((e) => parseFloat(e.vesting_shares) !== 0)
    .sort(
      (a, b) => parseFloat(b.vesting_shares) - parseFloat(a.vesting_shares),
    );
};

export const getConversionRequests = async (name) => {
  return await getClient().database.call('get_conversion_requests', [name]);
};

export const rpcList = [
  'DEFAULT',
  'https://api.hive.blog/',
  'https://api.openhive.network/',
  'https://api.hivekings.com/',
  'https://anyx.io/',
  'https://api.pharesim.me/',
  'https://hived.hive-engine.com/',
  'https://hived.privex.io/',
  'https://hive.roelandp.nl',
  'https://rpc.ausbit.dev',
  'https://rpc.ecency.com',
  'https://techcoderx.com',
  'https://hive-api.arcange.eu/',
  'TESTNET',
];

export const getAccountKeys = async (username) => {
  const account = (await getClient().database.getAccounts([username]))[0];
  return {
    memo: account.memo_key,
    active: account.active,
    posting: account.posting,
  };
};

export const sanitizeUsername = (username) =>
  username.toLowerCase().replaceAll(' ', '');

export const sanitizeAmount = (amount, currency, decimals = 3) => {
  const res = `${parseFloat(amount.replaceAll(',', '.')).toFixed(
    decimals,
  )} ${currency}`;
  console.log(res);
  return res;
};
