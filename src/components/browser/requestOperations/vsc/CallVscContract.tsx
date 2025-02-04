import {KeyTypes} from 'actions/interfaces';
import {RequestId, RequestVscCallContract} from 'hive-keychain-commons';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {translate} from 'utils/localize';
import CollapsibleData from '../components/CollapsibleData';
import RequestItem from '../components/RequestItem';
import RequestOperation from '../components/RequestOperation';
import {RequestComponentCommonProps} from '../requestOperations.types';

type Props = {
  request: RequestVscCallContract & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, action, contractId, payload, method} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.convert`, {})}
      beautifyError
      method={request.method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        //TODO : op here
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.key')} content={method} />
      <RequestItem
        title={translate('request.item.contract_id')}
        content={contractId}
      />
      <RequestItem title={translate('request.item.action')} content={action} />
      <CollapsibleData
        title={translate('request.item.payload')}
        hidden={translate('request.item.hidden_data')}
        content={JSON.stringify(payload, undefined, 2)}
      />
    </RequestOperation>
  );
};
