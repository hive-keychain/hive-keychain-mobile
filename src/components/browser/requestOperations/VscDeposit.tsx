import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {transfer} from 'utils/hive';
import {RequestId, RequestVscDeposit} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestVscDeposit & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {amount, currency, to} = data;

  const {
    getUsername,
    getAccountKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.vscDeposit', {
        amount,
        currency,
        username: getUsername(),
      })}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      performOperation={async () => {
        return await transfer(
          getAccountKey(),
          {
            from: getUsername(),
            to: 'vsc.gateway',
            memo: to ? `to=${to}` : '',
            amount: `${amount} ${currency}`,
          },
          undefined,
        );
      }}>
      <RequestUsername />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
      {to && <RequestItem title={translate('common.to')} content={`@${to}`} />}
    </RequestOperation>
  );
};
