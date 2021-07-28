import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {addAccountAuth} from 'utils/hive';
import {beautifyErrorMessage} from 'utils/keychain';
import {RequestAddAccountAuthority, RequestId} from 'utils/keychain.types';
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
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        await addAccountAuth(key, data);
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
