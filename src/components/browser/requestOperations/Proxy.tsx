import {KeyTypes} from 'actions/interfaces';
import {ConfirmationDataTag} from 'components/operations/Confirmation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {setProxy} from 'utils/hive';
import {RequestId, RequestProxy} from 'utils/keychain.types';
import {translate} from 'utils/localize';
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
  const performOperation = async () => {
    return await setProxy(getAccountKey(), {
      account: getUsername(),
      proxy,
    });
  };
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
      RequestUsername={RequestUsername}
      performOperation={performOperation}
      confirmationData={[
        {tag: ConfirmationDataTag.REQUEST_USERNAME, title: '', value: ''},
        {
          title: 'request.item.proxy',
          value: proxy.length ? proxy : translate('common.none'),
          tag: proxy.length ? ConfirmationDataTag.USERNAME : undefined,
        },
      ]}
    />
  );
};
