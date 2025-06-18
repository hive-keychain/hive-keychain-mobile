import {
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  DelegateVestingSharesOperation,
  RecurrentTransferOperation,
  TransferOperation,
  UpdateProposalVotesOperation,
} from '@hiveio/dhive';
import {saveRequestedOperation} from 'actions/hive-uri';
import {Account} from 'actions/interfaces';
import RequestError from 'components/browser/requestOperations/components/RequestError';
import {RequestSuccess} from 'hive-keychain-commons';
import hiveTx from 'hive-tx';
import {DecodeResult, resolveCallback} from 'hive-uri';
import React from 'react';
import {Linking} from 'react-native';
import {RootState, store} from 'store';
import {validateAuthority} from './keychain';
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
} from './keychain.types';
import {ModalComponent} from './modal.enum';
import {goBack, navigate} from './navigation';

const DOMAIN = 'scanned';
export enum HiveUriOpType {
  op = 'op',
  ops = 'ops',
  tx = 'tx',
  msg = 'msg',
}
export const processQRCodeOp = async (
  opType: HiveUriOpType,
  qrRequest: DecodeResult,
) => {
  let request;
  qrRequest.params.signer = qrRequest.params.signer || 'stoodkev';
  if (opType === HiveUriOpType.msg) {
    const message: string = qrRequest.tx;
    const authority = qrRequest.params?.authority;
    request = {
      domain: DOMAIN,
      username: qrRequest?.params?.signer,
      type: KeychainRequestTypes.signBuffer,
      message,
      method:
        KeychainKeyTypes[authority?.toLowerCase() as KeychainKeyTypesLC] ||
        KeychainKeyTypes.active,
    } as RequestSignBuffer;
  } else if (qrRequest.params.no_broadcast || opType === HiveUriOpType.tx) {
    let tx = qrRequest.tx;
    if (opType !== HiveUriOpType.tx) {
      const trx = new hiveTx.Transaction();
      tx = await trx.create(qrRequest.tx.operations);
    }

    request = {
      domain: DOMAIN,
      type: KeychainRequestTypes.signTx,
      username: qrRequest?.params?.signer,
      tx,
      method:
        KeychainKeyTypes[
          qrRequest.params?.authority?.toLowerCase() as KeychainKeyTypesLC
        ] || KeychainKeyTypes.active,
    } as RequestSignTx;
  } else if (opType === HiveUriOpType.ops) {
    request = {
      domain: DOMAIN,
      type: KeychainRequestTypes.broadcast,
      username: qrRequest?.params?.signer,
      operations: qrRequest.tx.operations,
      method:
        KeychainKeyTypes[
          qrRequest.params?.authority?.toLowerCase() as KeychainKeyTypesLC
        ] || KeychainKeyTypes.active,
    } as RequestBroadcast;
  } else if (opType === HiveUriOpType.op) {
    const type = qrRequest.tx.operations[0][0];
    const data = qrRequest.tx.operations[0][1];
    switch (type) {
      case 'transfer': {
        const transferOp = data as TransferOperation[1] & {enforce: boolean};
        const [amount, currency] = (transferOp.amount as string).split(' ');
        if (currency === 'HIVE' || currency === 'HBD') {
          request = {
            domain: DOMAIN,
            type: KeychainRequestTypes.transfer,
            amount: (+amount).toFixed(3) + '',
            currency,
            username: transferOp.from || qrRequest?.params?.signer,
            to: transferOp.to,
            memo: transferOp.memo,
            enforce: !!transferOp.enforce,
          } as RequestTransfer;
        } else {
          request = {
            domain: DOMAIN,
            type: KeychainRequestTypes.sendToken,
            amount: (+amount).toFixed(3) + '',
            currency,
            username:
              qrRequest?.params?.signer ||
              (transferOp.from ??
                (store.getState() as RootState).activeAccount.name!),
            to: transferOp.to,
            memo: transferOp.memo,
          } as RequestSendToken;
        }
        break;
      }
      case 'delegate_vesting_shares': {
        const {
          delegatee,
          vesting_shares,
          delegator,
        } = data as DelegateVestingSharesOperation[1];
        const [amount, unit] = (vesting_shares as string).split(' ');
        request = {
          domain: DOMAIN,
          type: KeychainRequestTypes.delegation,
          delegatee,
          username: delegator || qrRequest?.params?.signer,
          amount:
            unit === 'HP'
              ? (+amount).toFixed(3) + ''
              : (+amount).toFixed(6) + '',
          unit,
        } as RequestDelegation;
        break;
      }
      case 'account_witness_vote': {
        const {
          witness,
          approve,
          account,
        } = data as AccountWitnessVoteOperation[1];
        request = {
          domain: DOMAIN,
          username: account || qrRequest?.params?.signer,
          type: KeychainRequestTypes.witnessVote,
          witness,
          vote: approve,
        } as RequestWitnessVote;
        break;
      }
      case 'account_witness_proxy': {
        const {proxy, account} = data as AccountWitnessProxyOperation[1];
        request = {
          domain: DOMAIN,
          username: account || qrRequest?.params?.signer,
          type: KeychainRequestTypes.proxy,
          proxy,
        } as RequestProxy;
        break;
      }
      case 'recurrent_transfer':
        {
          const {
            to,
            amount: amt,
            memo,
            from,
            recurrence,
            executions,
          } = data as RecurrentTransferOperation[1];
          const [amount, currency] = (amt as string).split(' ');

          request = {
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
        break;

      case 'update_proposal_votes': {
        const {
          proposal_ids,
          approve,
          extensions,
          voter,
        } = data as UpdateProposalVotesOperation[1];
        request = {
          domain: DOMAIN,
          username: voter || qrRequest?.params?.signer,
          type: KeychainRequestTypes.updateProposalVote,
          proposal_ids: JSON.stringify(proposal_ids),
          approve,
          extensions,
        } as RequestUpdateProposalVote;
        break;
      }
      default:
        {
          request = {
            domain: DOMAIN,
            type: KeychainRequestTypes.broadcast,
            username: qrRequest?.params?.signer,
            operations: qrRequest.tx.operations,
            method:
              KeychainKeyTypes[
                qrRequest.params?.authority?.toLowerCase() as KeychainKeyTypesLC
              ] || KeychainKeyTypes.active,
          } as RequestBroadcast;
        }
        break;
    }
  }
  const accounts: Account[] = await store.getState().accounts;

  if (accounts && accounts.length) {
    const validity = validateAuthority(accounts, request);

    if (validity.valid) {
      const payload = {
        request,
        accounts,
        sendResponse: async (response: RequestSuccess) => {
          let res: any;
          if (opType === HiveUriOpType.tx && !qrRequest.params.no_broadcast) {
            const tx = new hiveTx.Transaction(response.result);
            res = await tx.broadcast();
          }
          if (qrRequest?.params?.callback) {
            const callbackUrl = resolveCallback(qrRequest.params.callback, {
              sig:
                opType === HiveUriOpType.msg
                  ? response.result
                  : response.result.signatures || '',
              data: qrRequest,
              id: response.result.tx_id || res?.result?.tx_id,
            });

            Linking.openURL(callbackUrl);
          }
        },
        sendError: () => {},
      };
      navigate('ModalScreen', {
        name: ModalComponent.BROADCAST,
        data: payload,
      });
    } else {
      navigate('ModalScreen', {
        name: `Operation_${request.type}`,
        modalContent: (
          <RequestError
            onClose={() => {
              goBack();
            }}
            error={validity.error}
          />
        ),
      });
    }
  } else {
    store.dispatch(saveRequestedOperation(qrRequest));
  }
};
