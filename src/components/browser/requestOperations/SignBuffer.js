import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {signBuffer} from 'components/bridge';
import RequestOperation from './RequestOperation';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {domain, method, username, message} = data;

  return (
    <RequestOperation
      message={translate('request.message.signBuffer', {
        domain: urlTransformer(domain).hostname,
        method,
        username,
      })}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signBuffer')}
      errorMessage={translate('request.error.signBuffer')}
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys[method.toLowerCase()];
        const result = await signBuffer(key, message);
        return result;
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.message')}
        content={message}
      />
    </RequestOperation>
  );
};
