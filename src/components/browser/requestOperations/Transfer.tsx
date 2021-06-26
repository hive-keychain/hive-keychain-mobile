import {KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {beautifyTransferError} from 'utils/format';
import {transfer} from 'utils/hive';
import {getAccountKeys} from 'utils/hiveUtils';
import {RequestId, RequestTransfer} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestTransfer & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
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
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        let finalMemo = memo;
        if (memo.length && memo[0] === '#') {
          console.log('pwait');
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
          memo.length
            ? memo[0] === '#'
              ? `${memo.substring(1)} (${translate('common.encrypted')})`
              : memo
            : translate('common.none')
        }
      />
    </RequestOperation>
  );
};
