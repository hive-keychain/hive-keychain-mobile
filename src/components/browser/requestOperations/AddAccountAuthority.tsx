import {KeyTypes} from 'actions/interfaces';
import {RequestAddAccountAuthority, RequestId} from 'hive-keychain-commons';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {addAccountAuth} from 'utils/hive';
import {beautifyErrorMessage} from 'utils/keychain';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestAddAccountAuthority & RequestId;
} & RequestComponentCommonProps;

const AddAccountAuthority = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {weight, authorizedUsername, role, username} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.addAccountAuthority`, {
        role,
        authorizedUsername,
        weight,
      })}
      errorMessage={beautifyErrorMessage}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await addAccountAuth(key, data, options);
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.authorized_username')}
        content={`@${authorizedUsername}`}
      />
      <RequestItem title={translate('request.item.role')} content={role} />
      <RequestItem
        title={translate('request.item.weight')}
        content={weight + ''}
      />
    </RequestOperation>
  );
};

export default AddAccountAuthority;
