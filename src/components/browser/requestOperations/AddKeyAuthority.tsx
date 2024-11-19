import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {addKeyAuth} from 'utils/hive';
import {beautifyErrorMessage} from 'utils/keychain';
import {RequestAddKeyAuthority, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestAddKeyAuthority & RequestId;
} & RequestComponentCommonProps;

const AddKeyAuthority = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {weight, authorizedKey, role, username} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.addKeyAuthority`, {
        role,
        weight,
      })}
      errorMessage={beautifyErrorMessage}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await addKeyAuth(key, data, options);
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.authorized_key')}
        content={authorizedKey}
      />
      <RequestItem title={translate('request.item.role')} content={role} />
      <RequestItem
        title={translate('request.item.weight')}
        content={weight + ''}
      />
    </RequestOperation>
  );
};

export default AddKeyAuthority;
