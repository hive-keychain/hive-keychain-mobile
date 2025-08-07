import {Account, KeyTypes} from 'actions/interfaces';
import {decodeMemo} from 'components/bridge';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {urlTransformer} from 'utils/browser';
import {
  RequestDecode,
  RequestError,
  RequestId,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestDecode & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {domain, method, username, message} = data;

  return (
    <RequestOperation
      message={translate('request.message.decode', {
        domain: urlTransformer(domain).hostname,
        method,
        username,
      })}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.decode')}
      errorMessage={translate('request.error.decode')}
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={() => {
        return performDecodeOperation(accounts, request);
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
      ]}
    />
  );
};

const performDecodeOperation = async (
  accounts: Account[],
  request: RequestDecode & RequestId,
) => {
  const {method, message} = request;
  const account = accounts.find((e) => e.name === request.username);
  const key = account.keys[method.toLowerCase() as KeyTypes];
  const result = await decodeMemo(key, message);
  if (result === message) {
    throw 'error';
  }
  return result;
};

export const decodeWithoutConfirmation = (
  accounts: Account[],
  request: RequestDecode & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  processOperationWithoutConfirmation(
    () => performDecodeOperation(accounts, request),
    request,
    sendResponse,
    sendError,
    false,
    translate('request.success.decode'),
    translate('request.error.decode'),
  );
};
