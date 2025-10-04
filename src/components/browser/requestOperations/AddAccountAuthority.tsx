import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {
  RequestAddAccountAuthority,
  RequestId,
} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {addAccountAuth} from 'utils/hiveLibs.utils';
import {beautifyErrorMessage} from 'utils/keychain.utils';
import {translate} from 'utils/localize';
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
      }}
      confirmationData={[
        {
          title: 'request.item.username',
          value: `@${username}`,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.authorized_username',
          value: `@${authorizedUsername}`,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.role',
          value: role,
        },
        {
          title: 'request.item.weight',
          value: weight + '',
        },
      ]}
    />
  );
};

export default AddAccountAuthority;
