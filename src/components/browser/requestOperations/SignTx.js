import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import CollapsibleData from './components/CollapsibleData';
import {signTx} from 'utils/hive';
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {method, username, tx} = data;
  console.log(data);
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signTx')}
      errorMessage={translate('request.error.signTx')}
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys[method.toLowerCase()];
        if (!tx.extensions) {
          tx.extensions = [];
          tx.expiration = tx.expiration.split('.')[0];
        }
        return signTx(key, tx);
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
      <CollapsibleData
        title={translate('request.item.transaction')}
        content={JSON.stringify(tx, undefined, 2)}
        hidden={translate('request.item.hidden_data')}
      />
    </RequestOperation>
  );
};
