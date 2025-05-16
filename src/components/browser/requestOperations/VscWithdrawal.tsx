import {KeyTypes} from 'actions/interfaces';
import {RequestVscWithdrawal, VscUtils} from 'hive-keychain-commons';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {VSCConfig} from 'utils/config';
import {broadcastJson} from 'utils/hive';
import {RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestVscWithdrawal & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {amount, currency, netId, memo, to} = data;
  const {json, id} = VscUtils.getWithdrawJson(
    data,
    netId ?? VSCConfig.BASE_JSON.net_id,
  );
  const {
    getUsername,
    getAccountKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.vscWithdrawal', {
        amount,
        currency,
        username: getUsername(),
        to,
      })}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      performOperation={async (options: TransactionOptions) => {
        return await broadcastJson(
          getAccountKey(),
          getUsername(),
          id,
          true,
          json,
          options,
        );
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.to')} content={`@${to}`} />
      <RequestItem
        title={translate('common.amount')}
        content={`${amount} ${currency}`}
      />
      <RequestItem title={translate('common.memo')} content={memo} />
    </RequestOperation>
  );
};
