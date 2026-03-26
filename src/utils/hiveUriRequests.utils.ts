import {
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  DelegateVestingSharesOperation,
  RecurrentTransferOperation,
  TransferOperation,
  UpdateProposalVotesOperation,
} from '@hiveio/dhive';
import hiveTx from 'hive-tx';
import {DecodeResult} from 'hive-uri';
import {
  KeychainKeyTypes,
  KeychainKeyTypesLC,
  KeychainRequestTypes,
  RequestBroadcast,
  RequestDelegation,
  RequestProxy,
  RequestRecurrentTransfer,
  RequestSendToken,
  RequestSignBuffer,
  RequestSignTx,
  RequestTransfer,
  RequestUpdateProposalVote,
  RequestWitnessVote,
} from '../interfaces/keychain.interface';

const DOMAIN = 'scanned';

export enum HiveUriOpType {
  op = 'op',
  ops = 'ops',
  tx = 'tx',
  msg = 'msg',
}

const getRequestMethod = (authority?: string) =>
  KeychainKeyTypes[authority?.toLowerCase() as KeychainKeyTypesLC] ||
  KeychainKeyTypes.active;

const buildTransferRequest = (
  qrRequest: DecodeResult,
  activeAccountName?: string,
) => {
  const transferOp = qrRequest.tx.operations[0][1] as TransferOperation[1] & {
    enforce: boolean;
  };
  const [amount, currency] = (transferOp.amount as string).split(' ');
  if (currency === 'HIVE' || currency === 'HBD') {
    return {
      domain: DOMAIN,
      type: KeychainRequestTypes.transfer,
      amount: (+amount).toFixed(3) + '',
      currency,
      username: transferOp.from || qrRequest?.params?.signer,
      to: transferOp.to,
      memo: transferOp.memo,
      enforce: !!transferOp.enforce,
    } as RequestTransfer;
  }
  return {
    domain: DOMAIN,
    type: KeychainRequestTypes.sendToken,
    amount: (+amount).toFixed(3) + '',
    currency,
    username:
      qrRequest?.params?.signer ||
      (transferOp.from ?? activeAccountName ?? undefined),
    to: transferOp.to,
    memo: transferOp.memo,
  } as RequestSendToken;
};

export const buildRequestFromHiveUri = async (
  opType: HiveUriOpType,
  qrRequest: DecodeResult,
  activeAccountName?: string,
) => {
  if (opType === HiveUriOpType.msg) {
    return {
      domain: DOMAIN,
      username: qrRequest?.params?.signer,
      type: KeychainRequestTypes.signBuffer,
      message: qrRequest.tx as string,
      method: getRequestMethod(qrRequest.params?.authority),
    } as RequestSignBuffer;
  }

  if (qrRequest.params.no_broadcast || opType === HiveUriOpType.tx) {
    let tx = qrRequest.tx;
    if (opType !== HiveUriOpType.tx) {
      const trx = new hiveTx.Transaction();
      tx = await trx.create(qrRequest.tx.operations);
    }

    return {
      domain: DOMAIN,
      type: KeychainRequestTypes.signTx,
      username: qrRequest?.params?.signer,
      tx,
      method: getRequestMethod(qrRequest.params?.authority),
    } as RequestSignTx;
  }

  if (opType === HiveUriOpType.ops) {
    return {
      domain: DOMAIN,
      type: KeychainRequestTypes.broadcast,
      username: qrRequest?.params?.signer,
      operations: qrRequest.tx.operations,
      method: getRequestMethod(qrRequest.params?.authority),
    } as RequestBroadcast;
  }

  if (opType !== HiveUriOpType.op) {
    return {
      domain: DOMAIN,
      type: KeychainRequestTypes.broadcast,
      username: qrRequest?.params?.signer,
      operations: qrRequest.tx.operations,
      method: getRequestMethod(qrRequest.params?.authority),
    } as RequestBroadcast;
  }

  const type = qrRequest.tx.operations[0][0];
  const data = qrRequest.tx.operations[0][1];

  switch (type) {
    case 'transfer':
      return buildTransferRequest(qrRequest, activeAccountName);
    case 'delegate_vesting_shares': {
      const {delegatee, vesting_shares, delegator} =
        data as DelegateVestingSharesOperation[1];
      const [amount, unit] = (vesting_shares as string).split(' ');
      return {
        domain: DOMAIN,
        type: KeychainRequestTypes.delegation,
        delegatee,
        username: delegator || qrRequest?.params?.signer,
        amount:
          unit === 'HP' ? (+amount).toFixed(3) + '' : (+amount).toFixed(6) + '',
        unit,
      } as RequestDelegation;
    }
    case 'account_witness_vote': {
      const {witness, approve, account} = data as AccountWitnessVoteOperation[1];
      return {
        domain: DOMAIN,
        username: account || qrRequest?.params?.signer,
        type: KeychainRequestTypes.witnessVote,
        witness,
        vote: approve,
      } as RequestWitnessVote;
    }
    case 'account_witness_proxy': {
      const {proxy, account} = data as AccountWitnessProxyOperation[1];
      return {
        domain: DOMAIN,
        username: account || qrRequest?.params?.signer,
        type: KeychainRequestTypes.proxy,
        proxy,
      } as RequestProxy;
    }
    case 'recurrent_transfer': {
      const {to, amount: amt, memo, from, recurrence, executions} =
        data as RecurrentTransferOperation[1];
      const [amount, currency] = (amt as string).split(' ');

      return {
        domain: DOMAIN,
        type: KeychainRequestTypes.recurrentTransfer,
        to,
        amount,
        username: from || qrRequest?.params?.signer,
        currency,
        memo,
        recurrence,
        executions,
      } as RequestRecurrentTransfer;
    }
    case 'update_proposal_votes': {
      const {proposal_ids, approve, extensions, voter} =
        data as UpdateProposalVotesOperation[1];
      return {
        domain: DOMAIN,
        username: voter || qrRequest?.params?.signer,
        type: KeychainRequestTypes.updateProposalVote,
        proposal_ids: JSON.stringify(proposal_ids),
        approve,
        extensions,
      } as RequestUpdateProposalVote;
    }
    default:
      return {
        domain: DOMAIN,
        type: KeychainRequestTypes.broadcast,
        username: qrRequest?.params?.signer,
        operations: qrRequest.tx.operations,
        method: getRequestMethod(qrRequest.params?.authority),
      } as RequestBroadcast;
  }
};
