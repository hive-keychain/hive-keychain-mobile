import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {removeAccountAuth} from 'utils/hive';
import {beautifyErrorMessage} from 'utils/keychain';
import {RequestId, RequestRemoveAccountAuthority} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestRemoveAccountAuthority & RequestId;
} & RequestComponentCommonProps;

const RemoveAccountAuthority = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {authorizedUsername, role, username} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.removeAccountAuthority`, {
        role,
        authorizedUsername,
      })}
      errorMessage={beautifyErrorMessage}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        await removeAccountAuth(key, data);
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
    </RequestOperation>
  );
};

export default RemoveAccountAuthority;
