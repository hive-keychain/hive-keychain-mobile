import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {setProxy} from 'utils/hive';
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
  const {proxy} = data;
  const {
    getAccountKey,
    RequestUsername,
    getUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(
        `request.success.${proxy.length ? 'proxy' : 'remove_proxy'}`,
        {proxy},
      )}
      beautifyError
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return await setProxy(getAccountKey(), {
          account: getUsername(),
          proxy,
        });
      }}>
      <RequestUsername />
      <RequestItem
        title={translate('request.item.proxy')}
        content={proxy.length ? `@${proxy}` : translate('common.none')}
      />
    </RequestOperation>
  );
};
