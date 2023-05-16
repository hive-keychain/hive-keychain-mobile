import {getClient} from './hive';

/* istanbul ignore next */
const getSavingsWitdrawFrom = async (username: string) => {
  return await getClient().database.call('get_savings_withdraw_from', [
    username,
  ]);
};

export const SavingsUtils = {
  getSavingsWitdrawFrom,
};
