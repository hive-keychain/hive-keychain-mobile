import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {getAccountKeys} from 'utils/hiveUtils';
import {encodeMemo} from 'components/bridge';
import RequestOperation from './components/RequestOperation';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {receiver, method, username, message} = data;
  console.log(data);
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.encode')}
      errorMessage={translate('request.error.encode')}
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const to = await getAccountKeys(receiver.toLowerCase());
        let publicKey;
        if (data.method === 'Memo') {
          publicKey = to.memo;
        } else {
          publicKey = to[method.toLowerCase()].key_auths[0][0];
        }
        const key = account.keys[method.toLowerCase()];
        const result = await encodeMemo(key, publicKey, message);
        if (result === message) {
          throw 'error';
        }
        return result;
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.to')}
        content={`@${receiver}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.message')}
        content={message}
      />
    </RequestOperation>
  );
};
