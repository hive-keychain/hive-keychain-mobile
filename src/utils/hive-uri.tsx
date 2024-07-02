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
import {RootState, store} from 'store';
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
    case 'transfer': {
      const transferOp = data as TransferOperation[1] & {enforce: boolean};
      const [amount, currency] = (transferOp.amount as string).split(' ');
      request = {
        domain: DOMAIN,
        type: KeychainRequestTypes.transfer,
        amount: (+amount).toFixed(3) + '',
        currency,
        username:
          transferOp.from ??
          (store.getState() as RootState).activeAccount.name!,
        to: transferOp.to,
        memo: transferOp.memo,
        enforce: !!transferOp.enforce,
      } as RequestTransfer;
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
        username: delegator,
        amount:
          unit === 'HP' ? (+amount).toFixed(3) + '' : (+amount).toFixed(6) + '',
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
        username: account,
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
        username: account,
        type: KeychainRequestTypes.proxy,
        proxy,
      } as RequestProxy;
      break;
    }
    default:
      break;
  }

  const accounts = await store.getState().accounts;
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
