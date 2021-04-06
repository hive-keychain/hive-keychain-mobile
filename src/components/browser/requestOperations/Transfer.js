import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {transfer} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import {beautifyTransferError} from 'utils/format';
import {encodeMemo} from 'components/bridge';
import {getAccountKeys} from 'utils/hiveUtils';

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
    getAccountMemoKey,
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
        let finalMemo;
        if (memo.length && memo[0] === '#') {
          const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
          finalMemo = await encodeMemo(
            getAccountMemoKey(),
            receiverMemoKey,
            memo,
          );
          console.log(finalMemo);
        }
        return await transfer(getAccountKey(), {
          from: getUsername(),
          to,
          memo: finalMemo,
          amount: `${amount} ${currency}`,
        });
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.to')} content={`@${to}`} />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
      <RequestItem
        title={translate('request.item.memo')}
        content={
          memo.length && memo[0] === '#'
            ? `${memo.substring(1)} (${translate('common.encrypted')})`
            : memo
        }
      />
    </RequestOperation>
  );
};
