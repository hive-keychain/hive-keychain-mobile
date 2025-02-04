import {KeyTypes} from 'actions/interfaces';
import {RequestId, RequestProxy} from 'hive-keychain-commons';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {setProxy} from 'utils/hive';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestProxy & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
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
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
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
