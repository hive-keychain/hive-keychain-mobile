import {Account, AccountKeys} from 'actions/interfaces';
import {getClient} from './hive';
import {translate} from './localize';

const addAuthorizedAccount = async (
  username: string,
  authorizedAccount: string,
  existingAccounts: Account[],
): Promise<AccountKeys> => {
  if (username.trim().length === 0 || authorizedAccount.trim().length === 0)
    throw new Error('Please fill the fields');
  if (
    existingAccounts
      .map((localAccount: Account) => localAccount.name)
      .includes(username)
  ) {
    throw new Error(translate('toast.account_already'));
  }

  const hiveAccounts = await getClient().database.getAccounts([username]);

  if (!hiveAccounts || hiveAccounts.length === 0) {
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
    throw new Error(
      translate('toast.accounts_no_auth', {authorizedAccount, username}),
    );
  }

  if (activeAuth && activeAuth[1] >= activeKeyInfo.weight_threshold) {
    keys.active = existingAccounts.filter(
      (account) => account.name === authorizedAccount,
    )[0].keys.active;
    keys.activePubkey = `@${authorizedAccount}`;
  }
  if (postingAuth && postingAuth[1] >= postingKeyInfo.weight_threshold) {
    keys.active = existingAccounts.filter(
      (account) => account.name === authorizedAccount,
    )[0].keys.posting;
    keys.postingPubkey = `@${authorizedAccount}`;
  }

  return keys;
};

const AccountUtils = {addAuthorizedAccount};

export default AccountUtils;
