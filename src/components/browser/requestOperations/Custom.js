import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {broadcastJson} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {display_msg, username, id, json, method} = data;
  const {getAccountKey, RequestUsername} = usePotentiallyAnonymousRequest(
    request,
    accounts,
  );

  return (
    <RequestOperation
      message={display_msg}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signBuffer')}
      errorMessage={translate('request.error.signBuffer')}
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return await broadcastJson(
          getAccountKey(),
          username,
          id,
          method === 'Active',
          json,
        );
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.data')}
        content={JSON.stringify({id, json: JSON.parse(json)}, undefined, 2)}
      />
    </RequestOperation>
  );
};
