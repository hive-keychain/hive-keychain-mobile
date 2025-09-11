import {Asset} from '@hiveio/dhive';
import {ActiveAccount} from 'actions/interfaces';
import {
  depositToSavings,
  getClient,
  withdrawFromSavings,
} from './hiveLibs.utils';

/* istanbul ignore next */
const getSavingsWitdrawFrom = async (username: string) => {
  return await getClient().database.call('get_savings_withdraw_from', [
    username,
  ]);
};

const hasBalance = (balance: string | Asset, greaterOrEqualTo: number) => {
  return typeof balance === 'string'
    ? Asset.fromString(balance as string).amount >= greaterOrEqualTo
    : balance.amount >= greaterOrEqualTo;
};

const claimSavings = async (activeAccount: ActiveAccount) => {
  const {hbd_balance, savings_hbd_balance} = activeAccount.account;
  const hasHbd = hasBalance(hbd_balance, 0.001);
  const hasSavings = hasBalance(savings_hbd_balance, 0.001);
  if (hasHbd) {
    return await depositToSavings(activeAccount.keys.active!, {
      amount: '0.001 HBD',
      from: activeAccount.name!,
      to: activeAccount.name!,
      request_id: Date.now(),
      memo: '',
    });
    // return SavingsUtils.deposit(
    //   '0.001 HBD',
    //   activeAccount.name!,
    //   activeAccount.name!,
    //   activeAccount.keys.active!,
    // );
  } else if (hasSavings) {
    return await withdrawFromSavings(activeAccount.keys.active!, {
      request_id: Date.now(),
      from: activeAccount.name!,
      to: activeAccount.name!,
      amount: '0.001 HBD',
      memo: '',
    });
  } else {
    console.log(
      `@${activeAccount.name} has no HBD to deposit or savings to withdraw`,
    );
    return false;
  }
};

export const SavingsUtils = {
  getSavingsWitdrawFrom,
  hasBalance,
  claimSavings,
};
