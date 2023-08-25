import {Asset, ClaimRewardBalanceOperation} from '@hiveio/dhive';
import {getValFromString} from './format';
import {broadcast} from './hive';

const claimRewards = async (
  username: string,
  rewardHive: string | Asset,
  rewardHBD: string | Asset,
  rewardVests: string | Asset,
  postingKey: string,
) => {
  return await broadcast(postingKey, [
    [
      'claim_reward_balance',
      {
        account: username,
        reward_hive: rewardHive,
        reward_hbd: rewardHBD,
        reward_vests: rewardVests,
      },
    ] as ClaimRewardBalanceOperation,
  ]);
};

const hasReward = (
  reward_hbd: string,
  reward_hp: string,
  reward_hive: string,
): boolean => {
  return (
    getValFromString(reward_hbd) !== 0 ||
    getValFromString(reward_hp) !== 0 ||
    getValFromString(reward_hive) !== 0
  );
};

export const RewardsUtils = {
  claimRewards,
  hasReward,
};
