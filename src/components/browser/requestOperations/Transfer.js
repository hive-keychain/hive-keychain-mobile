import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {transfer} from 'utils/hive';
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
  const {to, memo, amount, currency} = data;
  const {
    getUsername,
    getAccountKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.transfer', {
        amount,
        currency,
        username: getUsername(),
        to,
      })}
      errorMessage={(err) => {
        switch (err.data.stack[0].context.method) {
          case 'adjust_balance':
            return translate('request.error.transfer.adjust_balance', {
              currency,
              username: getUsername(),
            });
          case 'get_account':
            return translate('request.error.transfer.get_account', {to});
          default:
            return translate('request.error.broadcasting');
        }
      }}
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return await transfer(getAccountKey(), {
          from: getUsername(),
          to,
          memo,
          amount: `${amount} ${currency}`,
        });
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.to')} content={`@${to}`} />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
      <RequestItem title={translate('request.item.memo')} content={memo} />
    </RequestOperation>
  );
};
