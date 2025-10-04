import {
  DynamicGlobalProperties,
  Operation,
  TransferOperation,
} from '@hiveio/dhive';
import {Asset, HistoryFiltersUtils} from 'hive-keychain-commons';
import moment from 'moment';
import TransactionUtils from './transactions.utils';

interface ExportTransactionOperation {
  datetime: string;
  transactionId: string;
  blockNumber: number;
  from?: string;
  to?: string;
  amount: number;
  currency: string;
  operationType: Operation;
}

const getOprerationBitmask = () => {
  const proposal_fee = 87;
  const collateralized_convert_immediate_conversion = 88;
  const op = HistoryFiltersUtils.operationOrders;
  return HistoryFiltersUtils.makeBitMaskFilter([
    op.transfer,
    op.interest,
    op.transfer_to_vesting,
    op.fill_vesting_withdraw,
    op.fill_convert_request,
    op.fill_collateralized_convert_request,
    collateralized_convert_immediate_conversion,
    op.fill_recurrent_transfer,
    op.fill_order,
    op.producer_reward,
    op.claim_reward_balance,
    op.escrow_release,
    op.account_create,
    op.account_create_with_delegation,
    op.proposal_pay,
    op.escrow_approve,
    proposal_fee,
  ]) as [number, number];
};
const downloadTransactions = async (
  username: string,
  startDate: Date,
  endDate: Date,
  globals: DynamicGlobalProperties,
  memoKey: string,
  feedback?: (percentage: number) => void,
) => {
  try {
    const MAX_LIMIT = 1000;
    const lastTransaction = await TransactionUtils.getLastTransaction(username);
    console.log('lastTransaction', lastTransaction);
    let limit = Math.min(lastTransaction, MAX_LIMIT);
    let start = lastTransaction;
    let rawTransactions: any[] = [];

    let operations: ExportTransactionOperation[] = [];
    let forceStop = false;
    const percentageDuration = endDate.getTime() - startDate.getTime();

    try {
      do {
        rawTransactions = (
          await TransactionUtils.getAccountTransactions(
            username,
            start,
            globals,
            memoKey,
          )
        )[0];

        console.log('rawTransactionsLength', rawTransactions.length);
        console.log(
          'rawTransactions',
          JSON.stringify(rawTransactions, null, 2),
        );
        for (let i = 0; i <= rawTransactions.length - 1; i++) {
          const tx = rawTransactions[i];
          console.log('tx', JSON.stringify(tx, null, 2));
          const operationPayload = tx;
          const operationType = tx['type'];
          const transactionInfo = tx;

          const date = process.env.IS_FIREFOX
            ? moment(transactionInfo.timestamp)
            : moment(transactionInfo.timestamp + 'z');
          const localDatetime = date.format('yyyy-MM-DD HH:mm:ss');
          if (
            endDate &&
            date.isSameOrAfter(moment(endDate).add(1, 'day'), 'day')
          )
            continue;

          if (startDate && date.isBefore(moment(startDate), 'day')) {
            forceStop = true;
            break;
          }

          const operation: ExportTransactionOperation = {
            operationType: operationType,
            datetime: localDatetime,
            transactionId: transactionInfo.trx_id,
            blockNumber: transactionInfo.block,
            to: 'NA',
            amount: 0,
            currency: 'NA',
            from: 'NA',
          };

          switch (operationType) {
            case 'transfer':
            case 'fill_recurrent_transfer': {
              const transferOperation = operationPayload as TransferOperation[1];
              const asset = Asset.fromString(
                transferOperation.amount.toString(),
              );
              operations.push({
                ...operation,
                from: transferOperation.from,
                to: transferOperation.to,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }
            case 'interest': {
              const asset = Asset.fromString(
                operationPayload.interest.toString(),
              );
              operations.push({
                ...operation,
                from: 'NA',
                to: operationPayload.owner,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }
            case 'transfer_to_vesting': {
              const asset = Asset.fromString(
                operationPayload.amount.toString(),
              );
              operations.push({
                ...operation,
                from: operationPayload.from,
                to: operationPayload.to,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }
            case 'fill_vesting_withdraw': {
              const asset = Asset.fromString(
                operationPayload.deposited.toString(),
              );
              operations.push({
                ...operation,
                from: operationPayload.from_account,
                to: operationPayload.to_account,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }

            case 'fill_convert_request': {
              let asset = Asset.fromString(
                operationPayload.amount_out.toString(),
              );
              operations.push({
                ...operation,
                from: operationPayload.owner,
                to: operationPayload.owner,
                amount: asset.amount,
                currency: asset.symbol,
              });
              asset = Asset.fromString(operationPayload.amount_in.toString());
              operations.push({
                ...operation,
                from: operationPayload.owner,
                to: operationPayload.owner,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }
            case 'fill_collateralized_convert_request': {
              let asset = Asset.fromString(
                operationPayload.amount_out.toString(),
              );
              operations.push({
                ...operation,
                from: operationPayload.owner,
                to: operationPayload.owner,
                amount: asset.amount,
                currency: asset.symbol,
              });
              asset = Asset.fromString(operationPayload.amount_in.toString());
              operations.push({
                ...operation,
                from: operationPayload.owner,
                to: operationPayload.owner,
                amount: asset.amount,
                currency: asset.symbol,
              });
              asset = Asset.fromString(
                operationPayload.excess_collateral.toString(),
              );
              operations.push({
                ...operation,
                from: operationPayload.owner,
                to: operationPayload.owner,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }

            case 'producer_reward': {
              let asset = Asset.fromString(
                operationPayload.vesting_shares.toString(),
              );
              operations.push({
                ...operation,
                to: operationPayload.producer,
                amount: asset.amount,
                currency: asset.symbol,
              });
              break;
            }
            case 'claim_reward_balance': {
              let asset = Asset.fromString(
                operationPayload.reward_hive.toString(),
              );
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.account,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              asset = Asset.fromString(operationPayload.reward_hbd.toString());
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.account,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              asset = Asset.fromString(
                operationPayload.reward_vests.toString(),
              );
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.account,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              break;
            }
            case 'escrow_release': {
              let asset = Asset.fromString(
                operationPayload.hbd_amount.toString(),
              );
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.to,
                  from: operationPayload.from,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              asset = Asset.fromString(operationPayload.hive_amount.toString());
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.to,
                  from: operationPayload.from,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              break;
            }
            case 'account_create':
            case 'account_create_with_delegation': {
              let asset = Asset.fromString(operationPayload.fee.toString());
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  from: operationPayload.creator,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              break;
            }
            case 'proposal_pay': {
              let asset = Asset.fromString(operationPayload.payment.toString());
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.receiver,
                  from: operationPayload.payer,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              break;
            }
            case 'fill_order': {
              let asset = Asset.fromString(
                operationPayload.current_pays.toString(),
              );
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.open_owner,
                  from: operationPayload.current_owner,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              asset = Asset.fromString(operationPayload.open_pays.toString());
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.current_owner,
                  from: operationPayload.open_owner,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              break;
            }
            case 'proposal_fee': {
              let asset = Asset.fromString(operationPayload.fee.toString());
              if (asset.amount > 0)
                operations.push({
                  ...operation,
                  to: operationPayload.treasury,
                  from: operationPayload.creator,
                  amount: asset.amount,
                  currency: asset.symbol,
                });
              break;
            }
            default:
              console.warn(`[ExportTransactions] missing ${operationType}`);
              break;
          }
        }
        let percentage;
        if (startDate && percentageDuration) {
          // take care of date
          const tx = rawTransactions[rawTransactions.length - 1];
          const transactionInfo = tx[1];
          const date = moment(transactionInfo.timestamp + 'z').toDate();

          const passedDuration = endDate.getTime() - date.getTime();
          percentage = (passedDuration / percentageDuration) * 100;
        } else {
          // use lastTransaction
          const index =
            lastTransaction - rawTransactions[rawTransactions.length - 1][0];
          percentage = (index / lastTransaction) * 100;
        }
        // sendBack percentage
        if (feedback) feedback(percentage);

        start = Math.min(start - 1000, rawTransactions[0][0] - 1);
      } while (start > MAX_LIMIT && !forceStop);
      return operations;
    } catch (err) {
      console.error('Error while fetching transactions', err);
    }
  } catch (error) {
    throw new Error(`Error downloading transactions: ${error}`);
  }
};

const ExportTransactionsUtils = {
  downloadTransactions,
};

export default ExportTransactionsUtils;
