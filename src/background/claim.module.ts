import {Asset} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadAccount} from 'actions/index';
import moment from 'moment';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {RootState, store} from 'store';
import AccountUtils from 'utils/account.utils';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {RewardsUtils} from 'utils/rewards.utils';
import {SavingsUtils} from 'utils/savings.utils';
import {ActiveAccountModule} from './active-account.module';

const start = async () => {
  console.log(`Will autoclaim every ${ClaimsConfig.FREQUENCY}mn`);
  await alarmHandler();
  timeOutAlarmHandler;
};

const alarmHandler = async () => {
  const allClaims: {[key: string]: any} = {};
  (
    await AsyncStorage.multiGet([
      KeychainStorageKeyEnum.CLAIM_ACCOUNTS,
      KeychainStorageKeyEnum.CLAIM_REWARDS,
      KeychainStorageKeyEnum.CLAIM_SAVINGS,
    ])
  ).forEach((item) => {
    allClaims[`${item[0]}`] = item[1] ? JSON.parse(item[1]) : false;
  });

  const allClaimsAccounts = allClaims[KeychainStorageKeyEnum.CLAIM_ACCOUNTS];
  const allClaimsRewards = allClaims[KeychainStorageKeyEnum.CLAIM_REWARDS];
  const allClaimsSavings = allClaims[KeychainStorageKeyEnum.CLAIM_SAVINGS];
  if (
    allClaimsAccounts &&
    Object.values(allClaimsAccounts).some((claim) => claim === true)
  ) {
    await initClaimAccounts(allClaimsAccounts);
  }

  if (
    allClaimsRewards &&
    Object.values(allClaimsRewards).some((claim) => claim === true)
  ) {
    await initClaimRewards(allClaimsRewards);
  }

  if (
    allClaimsSavings &&
    Object.values(allClaimsSavings).some((claim) => claim === true)
  ) {
    await initClaimSavings(allClaimsSavings);
  }
};

const timeOutAlarmHandler = setInterval(
  alarmHandler,
  ClaimsConfig.FREQUENCY * 1000 * 60,
);

const initClaimAccounts = async (claimAccounts: {[x: string]: boolean}) => {
  const users = Object.keys(claimAccounts).filter(
    (user) => claimAccounts[user] === true,
  );
  await iterateClaimAccounts(users);
};

const iterateClaimAccounts = async (users: string[]) => {
  const userExtendedAccounts = await AccountUtils.getAccounts(users);
  const localAccounts = ((await store.getState()) as RootState).accounts;

  for (const userAccount of userExtendedAccounts) {
    const activeAccount = await ActiveAccountModule.createActiveAccount(
      userAccount,
      localAccounts,
    );

    if (!activeAccount || !activeAccount.keys.active) {
      console.log('Cannot auto claim accounts, need active key!');
      await AutomatedTasksUtils.updateClaim(
        activeAccount?.name!,
        false,
        KeychainStorageKeyEnum.CLAIM_ACCOUNTS,
      );
      continue;
    }

    if (
      activeAccount &&
      activeAccount.rc.percentage > ClaimsConfig.freeAccount.MIN_RC_PCT
    ) {
      await AccountUtils.claimAccounts(activeAccount.rc, activeAccount);
    }
  }
};

const initClaimRewards = async (claimRewards: {[x: string]: boolean}) => {
  const users = Object.keys(claimRewards).filter(
    (user) => claimRewards[user] === true,
  );
  await iterateClaimRewards(users);
};

const iterateClaimRewards = async (users: string[]) => {
  const userExtendedAccounts = await AccountUtils.getAccounts(users);
  const localAccounts = ((await store.getState()) as RootState).accounts;

  for (const userAccount of userExtendedAccounts) {
    const activeAccount = await ActiveAccountModule.createActiveAccount(
      userAccount,
      localAccounts,
    );
    if (
      activeAccount &&
      RewardsUtils.hasReward(
        activeAccount.account.reward_hbd_balance as string,
        activeAccount.account.reward_vesting_balance
          .toString()
          .replace('VESTS', ''),
        activeAccount.account.reward_hive_balance as string,
      )
    ) {
      console.log(`Claiming rewards for @${activeAccount.name}`);

      await RewardsUtils.claimRewards(
        activeAccount.name!,
        userAccount.reward_hive_balance,
        userAccount.reward_hbd_balance,
        userAccount.reward_vesting_balance,
        activeAccount.keys.posting!,
      );
      const appActiveAccount = ((await store.getState()) as RootState)
        .activeAccount.name;
      if (activeAccount.name === appActiveAccount) {
        console.log('reloading active account after claiming');
        store.dispatch<any>(loadAccount(activeAccount.name));
      } else {
        console.log('not reloading', activeAccount.name, appActiveAccount);
      }
    }
  }
};

const initClaimSavings = async (claimSavings: {
  [username: string]: boolean;
}) => {
  const users = Object.keys(claimSavings).filter(
    (username) => claimSavings[username] === true,
  );
  await iterateClaimSavings(users);
};

const iterateClaimSavings = async (users: string[]) => {
  const userExtendedAccounts = await AccountUtils.getAccounts(users);
  const localAccounts = ((await store.getState()) as RootState).accounts;
  for (const userAccount of userExtendedAccounts) {
    const activeAccount = await ActiveAccountModule.createActiveAccount(
      userAccount,
      localAccounts,
    );
    if (!activeAccount) continue;
    if (!activeAccount.keys.active) {
      console.log('Cannot auto claim savings, need active key!');
      await AutomatedTasksUtils.updateClaim(
        activeAccount.name!,
        false,
        KeychainStorageKeyEnum.CLAIM_SAVINGS,
      );
      continue;
    }
    let baseDate: any =
      new Date(
        activeAccount?.account.savings_hbd_last_interest_payment!,
      ).getUTCFullYear() === 1970
        ? activeAccount?.account.savings_hbd_seconds_last_update
        : activeAccount?.account.savings_hbd_last_interest_payment;

    baseDate = moment(baseDate).utcOffset('+0000', true);
    const hasSavingsToClaim =
      Number(activeAccount?.account.savings_hbd_seconds) > 0 ||
      Asset.from(activeAccount?.account.savings_hbd_balance!).amount > 0;

    if (!hasSavingsToClaim) {
      console.log(
        `@${activeAccount?.name} doesn't have any savings interests to claim`,
      );
    } else {
      const canClaimSavings =
        moment(moment().utc()).diff(baseDate, 'days') >=
        ClaimsConfig.savings.delay;
      if (canClaimSavings) {
        try {
          if (await SavingsUtils.claimSavings(activeAccount!)) {
            console.log(`Claim savings for @${activeAccount?.name} successful`);
          }
        } catch (err) {
          console.log('Error while claiming savings');
        }
      } else {
        console.log(
          `Not time to claim savings yet for @${activeAccount?.name}`,
        );
      }
    }
  }
};

const ClaimModule = {
  start,
};

export default ClaimModule;
