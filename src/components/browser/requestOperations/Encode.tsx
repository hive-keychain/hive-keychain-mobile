import {Authority} from '@hiveio/dhive';
import {Account, KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import {
  RequestEncode,
  RequestError,
  RequestId,
  RequestSuccess,
} from 'hive-keychain-commons';
import React from 'react';
import {getAccountKeys} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestEncode & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {receiver, method, username, message} = data;
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.encode')}
      errorMessage={translate('request.error.encode')}
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return performEncodeOperation(accounts, request);
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.to')}
        content={`@${receiver}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.message')}
        content={message}
      />
    </RequestOperation>
  );
};

const performEncodeOperation = async (
  accounts: Account[],
  request: RequestEncode,
) => {
  const {receiver, method, message} = request;

  const account = accounts.find((e) => e.name === request.username);
  const to = await getAccountKeys(receiver.toLowerCase());
  let publicKey;
  if (method === 'Memo') {
    publicKey = to.memo;
  } else {
    publicKey = (to[method.toLowerCase() as KeyTypes] as Authority)
      .key_auths[0][0];
  }
  const key = account.keys[method.toLowerCase() as KeyTypes];
  const result = await encodeMemo(key, publicKey as string, message);
  if (result === message) {
    throw 'error';
  }
  return result;
};

export const encodeWithoutConfirmation = (
  accounts: Account[],
  request: RequestEncode & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  processOperationWithoutConfirmation(
    () => performEncodeOperation(accounts, request),
    request,
    sendResponse,
    sendError,
    false,
    translate('request.success.encode'),
    translate('request.error.encode'),
  );
};
