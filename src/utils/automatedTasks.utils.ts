import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActiveAccount} from 'actions/interfaces';
import {DropdownModalItem} from 'components/form/DropdownModal';
import {Token} from 'src/interfaces/tokens.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {ClaimsConfig} from './config';

const getClaims = async (username: string) => {
  const values: {[key: string]: any} = {};
  (
    await AsyncStorage.multiGet([
      KeychainStorageKeyEnum.CLAIM_ACCOUNTS,
      KeychainStorageKeyEnum.CLAIM_REWARDS,
      KeychainStorageKeyEnum.CLAIM_SAVINGS,
    ])
  ).forEach((item) => {
    values[`${item[0]}`] = item[1] ? JSON.parse(item[1]) : false;
  });

  const accountValue = values[KeychainStorageKeyEnum.CLAIM_ACCOUNTS]
    ? values[KeychainStorageKeyEnum.CLAIM_ACCOUNTS][username]
    : false;
  const rewardValue = values[KeychainStorageKeyEnum.CLAIM_REWARDS]
    ? values[KeychainStorageKeyEnum.CLAIM_REWARDS][username]
    : false;
  const savingsValue = values[KeychainStorageKeyEnum.CLAIM_SAVINGS]
    ? values[KeychainStorageKeyEnum.CLAIM_SAVINGS][username]
    : false;

  return {
    [KeychainStorageKeyEnum.CLAIM_ACCOUNTS]: accountValue,
    [KeychainStorageKeyEnum.CLAIM_REWARDS]: rewardValue,
    [KeychainStorageKeyEnum.CLAIM_SAVINGS]: savingsValue,
  };
};

const saveClaims = async (
  claimRewards: boolean,
  claimAccount: boolean,
  claimSavings: boolean,
  username: string,
) => {
  const values: {[key: string]: any} = {};
  (
    await AsyncStorage.multiGet([
      KeychainStorageKeyEnum.CLAIM_ACCOUNTS,
      KeychainStorageKeyEnum.CLAIM_REWARDS,
      KeychainStorageKeyEnum.CLAIM_SAVINGS,
    ])
  ).forEach((item) => {
    values[`${item[0]}`] = item[1] ? JSON.parse(item[1]) : false;
  });
  let allRewards = values[KeychainStorageKeyEnum.CLAIM_REWARDS] ?? {};
  let allAccounts = values[KeychainStorageKeyEnum.CLAIM_ACCOUNTS] ?? {};
  let allSavings = values[KeychainStorageKeyEnum.CLAIM_SAVINGS] ?? {};

  allRewards = {
    ...allRewards,
    [username]: claimRewards,
  };
  allAccounts = {
    ...allAccounts,
    [username]: claimAccount,
  };
  allSavings = {
    ...allSavings,
    [username]: claimSavings,
  };

  await AsyncStorage.multiSet([
    [KeychainStorageKeyEnum.CLAIM_REWARDS, JSON.stringify(allRewards)],
    [KeychainStorageKeyEnum.CLAIM_ACCOUNTS, JSON.stringify(allAccounts)],
    [KeychainStorageKeyEnum.CLAIM_SAVINGS, JSON.stringify(allSavings)],
  ]);
};

const updateClaim = async (
  username: string,
  enabled: boolean,
  claimType: KeychainStorageKeyEnum,
) => {
  let claims = JSON.parse(await AsyncStorage.getItem(claimType)) ?? {};
  claims = {
    ...claims,
    [username]: enabled,
  };
  await AsyncStorage.setItem(claimType, JSON.stringify(claims));
};

const canClaimSavingsErrorMessage = (
  activeAccount: ActiveAccount,
): string | undefined => {
  if (!activeAccount.keys.active) {
    return 'toast.claims.need_active_key_for_claim_savings';
  }
};

const canClaimRewardsErrorMessage = (
  activeAccount: ActiveAccount,
): string | undefined => {
  if (!activeAccount.keys.posting) {
    return 'toast.claims.need_posting_key_to_claim_rewards';
  }
};

const canClaimAccountErrorMessage = (
  activeAccount: ActiveAccount,
): string | undefined => {
  if (!activeAccount.keys.active) {
    return 'toast.claims.need_active_key_for_claim_accounts';
  } else if (activeAccount.rc.max_rc < ClaimsConfig.freeAccount.MIN_RC * 1.5) {
    return 'toast.claims.not_enough_rc_to_claim_account';
  }
};

const saveUserAutoStake = async (username: string, value: boolean) => {
  try {
    const autoStake = JSON.parse(
      await AsyncStorage.getItem(KeychainStorageKeyEnum.HE_AUTO_STAKE),
    );
    let autoStakeUsers: any = autoStake ? JSON.parse(autoStake) : {};
    if (Object.keys(autoStakeUsers).length > 0) {
      autoStakeUsers[username] = value;
    } else {
      autoStakeUsers = {
        ...autoStakeUsers,
        [username]: value,
      };
    }
    AsyncStorage.setItem(
      KeychainStorageKeyEnum.HE_AUTO_STAKE,
      JSON.stringify(autoStakeUsers),
    );
  } catch (e) {}
};

const getUserAutoStake = async (username: string) => {
  try {
    const autoStake = JSON.parse(
      await AsyncStorage.getItem(KeychainStorageKeyEnum.HE_AUTO_STAKE),
    );
    return autoStake && autoStake[username] ? true : false;
  } catch (e) {
    return false;
  }
};

const getUserAutoStakeList = async (
  username: string,
  tokens: Token[],
): Promise<DropdownModalItem[]> => {
  try {
    const autoStakeList = JSON.parse(
      await AsyncStorage.getItem(
        KeychainStorageKeyEnum.LAYER_TWO_AUTO_STAKE_TOKENS,
      ),
    );
    const savedTokens =
      autoStakeList && autoStakeList[username] ? autoStakeList[username] : [];
    return savedTokens.map((savedToken: {symbol: string}) => {
      const tk = tokens.find((e) => e.symbol === savedToken.symbol);
      return {label: tk.symbol, value: tk.symbol, icon: tk.metadata.icon};
    });
  } catch (e) {
    return [];
  }
};

const updateAutoStakeTokenList = async (
  username: string,
  list: DropdownModalItem[],
) => {
  const reMappedList = list.map((c) => {
    return {symbol: c.value};
  });
  const currentList = JSON.parse(
    await AsyncStorage.getItem(
      KeychainStorageKeyEnum.LAYER_TWO_AUTO_STAKE_TOKENS,
    ),
  );
  let autoStakeList: any = currentList ?? {};
  if (Object.keys(autoStakeList).length > 0) {
    autoStakeList[username] = reMappedList;
  } else {
    autoStakeList = {
      ...autoStakeList,
      [username]: reMappedList,
    };
  }
  AsyncStorage.setItem(
    KeychainStorageKeyEnum.LAYER_TWO_AUTO_STAKE_TOKENS,
    JSON.stringify(autoStakeList),
  );
};

const AutomatedTasksUtils = {
  getClaims,
  saveClaims,
  updateClaim,
  canClaimSavingsErrorMessage,
  canClaimAccountErrorMessage,
  canClaimRewardsErrorMessage,
  getUserAutoStakeList,
  getUserAutoStake,
  saveUserAutoStake,
  updateAutoStakeTokenList,
};

export default AutomatedTasksUtils;
