import {
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  DelegateVestingSharesOperation,
  Operation,
  TransferOperation,
} from '@hiveio/dhive';
import {saveRequestedOperation} from 'actions/hive-uri';
import RequestError from 'components/browser/requestOperations/components/RequestError';
import React from 'react';
import {store} from 'store';
import {validateAuthority} from './keychain';
import {
  KeychainRequestTypes,
  RequestDelegation,
  RequestProxy,
  RequestTransfer,
  RequestWitnessVote,
} from './keychain.types';
import {ModalComponent} from './modal.enum';
import {goBack, navigate} from './navigation';

const DOMAIN = 'scanned';

export const processQRCodeOp = async (op: Operation) => {
  const type = op[0];
  const data = op[1];
  let request;
  switch (type) {
    case 'transfer':
      const transferOp = data as TransferOperation[1];
      const [amount, currency] = (transferOp.amount as string).split(' ');
      request = {
        domain: DOMAIN,
        type: KeychainRequestTypes.transfer,
        amount: (+amount).toFixed(3) + '',
        currency,
        to: transferOp.to,
        memo: transferOp.memo,
        enforce: false,
      } as RequestTransfer;
      break;
    case 'delegate_vesting_shares': {
      const {
        delegatee,
        vesting_shares,
      } = data as DelegateVestingSharesOperation[1];
      const [amount, unit] = (vesting_shares as string).split(' ');
      request = {
        domain: DOMAIN,
        type: KeychainRequestTypes.delegation,
        delegatee,
        amount:
          unit === 'HP' ? (+amount).toFixed(3) + '' : (+amount).toFixed(6) + '',
        unit,
      } as RequestDelegation;
      break;
    }
    case 'account_witness_vote':
      const {witness, approve} = data as AccountWitnessVoteOperation[1];
      request = {
        domain: DOMAIN,
        type: KeychainRequestTypes.witnessVote,
        witness,
        vote: approve,
      } as RequestWitnessVote;
      break;
    case 'account_witness_proxy':
      const {proxy} = data as AccountWitnessProxyOperation[1];
      request = {
        domain: DOMAIN,
        type: KeychainRequestTypes.proxy,
        proxy,
      } as RequestProxy;
      break;
    default:
      break;
  }
  console.log({ state: store.getState()});  //TODO to remove
  const accounts = await store.getState().accounts;
  console.log('accounts', accounts);
  if (accounts && accounts.length) {
    const validity = validateAuthority(accounts, request);
    if (validity.valid) {
      const payload = {
        request,
        accounts,
        sendResponse: () => {},
        sendError: () => {},
      };
      navigate('ModalScreen', {
        name: ModalComponent.BROADCAST,
        data: payload,
      });
    } else {
      navigate('ModalScreen', {
        name: `Operation_${data.type}`,
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
    store.dispatch(saveRequestedOperation(op));
  }
};
