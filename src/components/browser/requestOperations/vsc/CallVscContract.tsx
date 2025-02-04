import {KeyTypes} from 'actions/interfaces';
import {RequestId, RequestVscCallContract} from 'hive-keychain-commons';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {translate} from 'utils/localize';
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
  const {username, action, contractId, payload} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.convert`, {})}
      beautifyError
      method={KeyTypes.active}
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
      <></>
    </RequestOperation>
  );
};
