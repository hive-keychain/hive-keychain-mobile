import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {broadcastJson} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import CollapsibleData from './components/CollapsibleData';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
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
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        console.log(
          getAccountKey(),
          getUsername(),
          id,
          method === 'Active',
          json,
        );
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
