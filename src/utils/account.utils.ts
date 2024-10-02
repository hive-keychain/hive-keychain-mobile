import {
  ClaimAccountOperation,
  DynamicGlobalProperties,
  ExtendedAccount,
} from '@hiveio/dhive';
import {Account, AccountKeys, ActiveAccount, RC} from 'actions/interfaces';
import {ClaimsConfig} from './config';
import {broadcast, getClient, getData} from './hive';
import {KeyUtils} from './key.utils';
import {translate} from './localize';

const addAuthorizedAccount = async (
  username: string,
  authorizedAccount: string,
  existingAccounts: Account[],
  simpleToast?: any,
): Promise<AccountKeys> => {
  let localAuthorizedAccount: Account;

  if (username.trim().length === 0 || authorizedAccount.trim().length === 0)
    throw new Error('Please fill the fields');
  if (
    existingAccounts
      .map((localAccount: Account) => localAccount.name)
      .includes(username)
  ) {
    if (simpleToast) {
      simpleToast.show(
        translate('toast.account_already', {account: username}),
        simpleToast.LONG,
      );
      return;
    }
    throw new Error(translate('toast.account_already', {account: username}));
  }
  if (
    !existingAccounts
      .map((localAccount: Account) => localAccount.name)
      .includes(authorizedAccount)
  ) {
    if (simpleToast) return;
    throw new Error(translate('toast.no_auth_account', {authorizedAccount}));
  } else {
    localAuthorizedAccount = existingAccounts.find(
      (localAccount: Account) => localAccount.name,
    )!;
  }

  const hiveAccounts = await getClient().database.getAccounts([username]);

  if (!hiveAccounts || hiveAccounts.length === 0) {
    if (simpleToast) {
      simpleToast.show(translate('toast.incorrect_user'), simpleToast.LONG);
      return;
    }
    throw new Error(translate('toast.incorrect_user'));
  }
  let hiveAccount = hiveAccounts[0];

  const activeKeyInfo = hiveAccount.active;
  const postingKeyInfo = hiveAccount.posting;

  let keys: AccountKeys = {};

  const activeAuth = activeKeyInfo.account_auths.find(
    (accountAuth) => accountAuth[0] === authorizedAccount,
  );
  const postingAuth = postingKeyInfo.account_auths.find(
    (accountAuth) => accountAuth[0] === authorizedAccount,
  );

  if (!activeAuth && !postingAuth) {
    if (simpleToast) return;
    throw new Error(
      translate('toast.accounts_no_auth', {authorizedAccount, username}),
    );
  }

  if (activeAuth) {
    keys.active = existingAccounts.filter(
      (account) => account.name === authorizedAccount,
    )[0].keys.active;
    keys.activePubkey = `@${authorizedAccount}`;
  }
  if (postingAuth) {
    keys.posting = existingAccounts.filter(
      (account) => account.name === authorizedAccount,
    )[0].keys.posting;
    keys.postingPubkey = `@${authorizedAccount}`;
  }

  return keys;
};

const doesAccountExist = async (username: string) => {
  return (await AccountUtils.getAccount(username)).length > 0;
};

const getAccount = async (username: string) => {
  return getClient().database.getAccounts([username]);
};

const getAccounts = async (usernames: string[]) => {
  return getClient().database.getAccounts(usernames);
};

const getRCMana = async (username: string) => {
  const result = await getData('rc_api.find_rc_accounts', {
    accounts: [username],
  });

  let manabar = result.rc_accounts[0].rc_manabar;
  const max_mana = Number(result.rc_accounts[0].max_rc);

  const delta: number = Date.now() / 1000 - manabar.last_update_time;
  let current_mana = Number(manabar.current_mana) + (delta * max_mana) / 432000;
  let percentage: number = +((current_mana / max_mana) * 100).toFixed(2);

  if (!isFinite(percentage) || percentage < 0) {
    percentage = 0;
  } else if (percentage > 100) {
    percentage = 100;
  }

  return {
    ...result.rc_accounts[0],
    percentage: percentage,
  };
};

const claimAccounts = async (rc: RC, activeAccount: ActiveAccount) => {
  const freeAccountConfig = ClaimsConfig.freeAccount;
  if (
    activeAccount.rc.percentage > freeAccountConfig.MIN_RC_PCT &&
    parseFloat(rc.rc_manabar.current_mana) > freeAccountConfig.MIN_RC
  ) {
    console.log(`Claiming free account for @${activeAccount.name}`);

    return await broadcast(activeAccount.keys.active!, [
      [
        'claim_account',
        {
          creator: activeAccount.name,
          extensions: [],
          fee: '0.000 HIVE',
        },
      ] as ClaimAccountOperation,
    ]);
  } else console.log('Not enough RC% to claim account');
};

const getPowerDown = (
  account: ExtendedAccount,
  globalProperties: DynamicGlobalProperties,
) => {
  const totalSteem = Number(
    globalProperties.total_vesting_fund_hive.toString().split(' ')[0],
  );
  const totalVests = Number(
    globalProperties.total_vesting_shares.toString().split(' ')[0],
  );

  const withdrawn = (
    ((Number(account.withdrawn) / totalVests) * totalSteem) /
    1000000
  ).toFixed(3);

  const total_withdrawing = (
    ((Number(account.to_withdraw) / totalVests) * totalSteem) /
    1000000
  ).toFixed(3);
  const next_vesting_withdrawal = account.next_vesting_withdrawal;
  return {withdrawn, total_withdrawing, next_vesting_withdrawal};
};

const generateQRCode = (account: ActiveAccount) => {
  return JSON.stringify({name: account.name, keys: account.keys});
};

const generateQRCodeFromAccount = (account: Account) => {
  let acc: Account = {name: account.name, keys: {}};
  if (KeyUtils.isExportable(account.keys.active, account.keys.activePubkey)) {
    acc.keys.active = account.keys.active;
    if (account.keys.activePubkey?.startsWith('@'))
      acc.keys.activePubkey = account.keys.activePubkey;
  }
  if (KeyUtils.isExportable(account.keys.posting, account.keys.postingPubkey)) {
    acc.keys.posting = account.keys.posting;
    if (account.keys.postingPubkey?.startsWith('@'))
      acc.keys.postingPubkey = account.keys.postingPubkey;
  }
  if (KeyUtils.isExportable(account.keys.memo, account.keys.memoPubkey)) {
    acc.keys.memo = account.keys.memo;
    acc.keys.memoPubkey = account.keys.memoPubkey;
  }
  return JSON.stringify(acc);
};

const AccountUtils = {
  addAuthorizedAccount,
  doesAccountExist,
  getAccount,
  getAccounts,
  getRCMana,
  claimAccounts,
  getPowerDown,
  generateQRCode,
  generateQRCodeFromAccount,
};

export default AccountUtils;
