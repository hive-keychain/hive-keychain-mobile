import {KeyTypes} from 'actions/interfaces';
import {signBuffer} from 'components/bridge';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {urlTransformer} from 'utils/browser';
import {RequestId, RequestSignBuffer} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSignBuffer & RequestId;
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
  const {
    getAccountKey,
    getAccountPublicKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      message={
        username
          ? translate('request.message.signBuffer', {
              domain: urlTransformer(domain).hostname,
              method,
              username,
            })
          : translate('request.message.signBufferNoUsername', {
              domain: urlTransformer(domain).hostname,
              method,
            })
      }
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signBuffer')}
      errorMessage={translate('request.error.signBuffer')}
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      additionalData={{
        publicKey: getAccountPublicKey(),
      }}
      performOperation={async () => {
        return await signBuffer(getAccountKey(), message);
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.message')}
        content={message}
      />
    </RequestOperation>
  );
};
