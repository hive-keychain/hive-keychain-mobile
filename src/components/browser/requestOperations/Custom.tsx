import {Account, KeyTypes} from 'actions/interfaces';
import {ConfirmationDataTag} from 'components/operations/ConfirmationCard';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {broadcastJson} from 'utils/hive';
import {
  RequestCustomJSON,
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
  request: RequestCustomJSON & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {display_msg, id, json, method} = data;
  const {
    getUsername,
    getAccountKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      message={display_msg}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.broadcast')}
      beautifyError
      method={method.toLowerCase() as KeyTypes}
      request={request}
      selectedUsername={getUsername()}
      closeGracefully={closeGracefully}
      RequestUsername={RequestUsername}
      performOperation={async (options: TransactionOptions) => {
        return await broadcastJson(
          getAccountKey(),
          getUsername(),
          id,
          method === 'Active',
          json,
          options,
        );
      }}
      confirmationData={[
        {
          tag: ConfirmationDataTag.REQUEST_USERNAME,
          title: 'request.item.username',
          value: '',
        },
        {
          title: 'request.item.method',
          value: method,
        },
        {
          title: 'request.item.data',
          hidden: translate('request.item.hidden_data'),
          value: JSON.stringify({id, json: JSON.parse(json)}, undefined, 2),
          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
      ]}
    />
  );
};

const performBroadcastJSONOperation = async (
  accounts: Account[],
  request: RequestCustomJSON & RequestId,
  options?: TransactionOptions,
) => {
  const {id, json, method, username} = request;

  return await broadcastJson(
    accounts.find((e) => e.name === username).keys[
      method.toLowerCase() as KeyTypes
    ],
    username,
    id,
    method === 'Active',
    json,
    options,
  );
};

export const broacastCustomJSONWithoutConfirmation = (
  accounts: Account[],
  request: RequestCustomJSON & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
  options?: TransactionOptions,
) => {
  processOperationWithoutConfirmation(
    async () => await performBroadcastJSONOperation(accounts, request, options),
    request,
    sendResponse,
    sendError,
    true,
    translate('request.success.broadcast'),
  );
};
