import {Account, KeyTypes} from 'actions/interfaces';
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
import CollapsibleData from './components/CollapsibleData';
import RequestItem from './components/RequestItem';
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
      performOperation={async (options: TransactionOptions) => {
        return await broadcastJson(
          getAccountKey(),
          getUsername(),
          id,
          method === 'Active',
          json,
          options,
        );
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.method')} content={method} />
      <CollapsibleData
        title={translate('request.item.data')}
        hidden={translate('request.item.hidden_data')}
        content={JSON.stringify({id, json: JSON.parse(json)}, undefined, 2)}
      />
    </RequestOperation>
  );
};

const performBroadcastJSONOperation = async (
  accounts: Account[],
  request: RequestCustomJSON & RequestId,
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
  );
};

export const broacastCustomJSONWithoutConfirmation = (
  accounts: Account[],
  request: RequestCustomJSON & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  processOperationWithoutConfirmation(
    async () => await performBroadcastJSONOperation(accounts, request),
    request,
    sendResponse,
    sendError,
    true,
    translate('request.success.broadcast'),
  );
};
