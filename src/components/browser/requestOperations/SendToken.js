import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {sendToken} from 'utils/hive';
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {username, amount, to, currency, memo} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.sendToken')}
      errorMessage={translate('request.error.broadcast')}
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await sendToken(key, username, {
          symbol: currency,
          to: to,
          quantity: amount,
          memo: memo,
        });
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.to')} content={`@${to}`} />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
      <RequestItem title={translate('request.item.memo')} content={memo} />
    </RequestOperation>
  );
};
