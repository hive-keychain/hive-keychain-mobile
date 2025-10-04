import {ExtendedAccount} from '@hiveio/dhive';
import {Account, ActiveAccount} from 'actions/interfaces';
import AccountUtils from 'utils/account.utils';

const createActiveAccount = async (
  userAccount: ExtendedAccount,
  localAccounts: Account[],
) => {
  const localAccount = localAccounts.find(
    (localAccount) => localAccount.name === userAccount.name,
  );
  if (!localAccount) {
    return;
  }
  const activeAccount: ActiveAccount = {
    account: userAccount,
    keys: localAccount.keys,
    name: localAccount.name,
    rc: await AccountUtils.getRCMana(localAccount.name),
  };

  return activeAccount;
};

export const ActiveAccountModule = {
  createActiveAccount,
};
