import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {powerUp} from 'utils/hive';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {username, recipient: to, steem: hive} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.power_up', {
        hive,
        to,
      })}
      beautifyError
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await powerUp(key, {
          from: username,
          to,
          amount: `${hive} HIVE`,
        });
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.to')} content={`@${to}`} />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${hive} HIVE`}
      />
    </RequestOperation>
  );
};
