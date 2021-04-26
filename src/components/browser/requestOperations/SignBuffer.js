import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {signBuffer} from 'components/bridge';
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
      method={method}
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
