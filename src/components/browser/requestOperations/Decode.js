import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {decodeMemo} from 'components/bridge';
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
      message={translate('request.message.decode', {
        domain: urlTransformer(domain).hostname,
        method,
        username,
      })}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.decode')}
      errorMessage={translate('request.error.decode')}
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys[method.toLowerCase()];
        const result = await decodeMemo(key, message);
        if (result === message) {
          throw 'error';
        }
        return result;
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
    </RequestOperation>
  );
};
