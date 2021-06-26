import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {broadcastJson} from 'utils/hive';
import {RequestCustomJSON, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import CollapsibleData from './components/CollapsibleData';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
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
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return await broadcastJson(
          getAccountKey(),
          getUsername(),
          id,
          method === 'Active',
          json,
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
