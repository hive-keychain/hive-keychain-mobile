import {CancelTransferFromSavingsOperation} from '@hiveio/dhive';
import {getClient} from './hive';

/* istanbul ignore next */
const getSavingsWitdrawFrom = async (username: string) => {
  return await getClient().database.call('get_savings_withdraw_from', [
    username,
  ]);
};
/* istanbul ignore next */
const getCancelTransferFromSavingsOperation = (
  username: string,
  request_id: number,
) => {
  return [
    'cancel_transfer_from_savings',
    {
      from: username,
      request_id,
    },
  ] as CancelTransferFromSavingsOperation;
};
/* istanbul ignore next */
//   const cancelCurrentWithdrawSaving = async (
//     username: string,
//     request_id: number,
//     activeKey: Key,
//   ) => {
//     return await HiveTxUtils.sendOperation(
//       [SavingsUtils.getCancelTransferFromSavingsOperation(username, request_id)],
//       activeKey,
//     );
//   };

export const SavingsUtils = {
  getSavingsWitdrawFrom,
  getCancelTransferFromSavingsOperation,
  // cancelCurrentWithdrawSaving,
};
