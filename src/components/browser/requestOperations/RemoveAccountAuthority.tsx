import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {removeAccountAuth} from 'utils/hive';
import {beautifyErrorMessage} from 'utils/keychain';
import {RequestId, RequestRemoveAccountAuthority} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';

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
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await removeAccountAuth(key, data, options);
      }}>
      <UsernameWithAvatar
        title={translate('request.item.username')}
        username={username}
      />
      <UsernameWithAvatar
        title={translate('request.item.authorized_username')}
        username={authorizedUsername}
      />
      <RequestItem title={translate('request.item.role')} content={role} />
    </RequestOperation>
  );
};

export default RemoveAccountAuthority;
