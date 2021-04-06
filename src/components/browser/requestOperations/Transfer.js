import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {transfer} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import {beautifyTransferError} from 'utils/format';

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
      errorMessage={beautifyTransferError}
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
