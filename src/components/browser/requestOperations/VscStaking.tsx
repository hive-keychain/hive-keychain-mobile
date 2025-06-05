import {KeyTypes} from 'actions/interfaces';
import {RequestVscStaking, VscUtils} from 'hive-keychain-commons';
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
  request: RequestVscStaking & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {amount, currency, netId, to, operation} = data;
  const {json, id} = VscUtils.getStakingJson(
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
      successMessage={translate('request.success.vscStaking', {
        staking: operation.toLowerCase(),
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
        title={translate('request.item.action')}
        content={
          operation.toLowerCase() === 'unstake'
            ? translate('common.unstake')
            : translate('common.stake')
        }
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
    </RequestOperation>
  );
};
