import {Account, KeyTypes} from 'actions/interfaces';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {
  RequestError,
  RequestId,
  RequestSignTx,
  RequestSuccess,
} from 'src/interfaces/keychain.interface';
import {signTx} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSignTx & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;

  const {method, username, tx} = data;
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signTx')}
      errorMessage={translate('request.error.signTx')}
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return performSignTxOperation(accounts, request);
      }}
      confirmationData={[
        {
          title: 'request.item.username',
          value: username,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.method',
          value: method,
        },
        {
          title: 'request.item.transaction',
          hidden: translate('request.item.hidden_data'),
          value: JSON.stringify(tx, undefined, 2),
          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
      ]}
    />
  );
};
const performSignTxOperation = async (
  accounts: Account[],
  request: RequestSignTx,
) => {
  const {method, username, tx} = request;
  const account = accounts.find((e) => e.name === username);
  const key = account.keys[method.toLowerCase() as KeyTypes];
  if (!tx.extensions) {
    tx.extensions = [];
    tx.expiration = tx.expiration.split('.')[0];
  }
  return signTx(key, tx);
};

export const signTxWithoutConfirmation = (
  accounts: Account[],
  request: RequestSignTx & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  processOperationWithoutConfirmation(
    async () => await performSignTxOperation(accounts, request),
    request,
    sendResponse,
    sendError,
    false,
    translate('request.success.signTx'),
    translate('request.error.signTx'),
  );
};
