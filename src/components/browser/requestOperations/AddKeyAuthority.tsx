import {KeyTypes} from 'actions/interfaces';
import {FormatUtils} from 'hive-keychain-commons';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {addKeyAuth} from 'utils/hive';
import {beautifyErrorMessage} from 'utils/keychain';
import {RequestAddKeyAuthority, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
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
      }}
      confirmationData={[
        {
          title: 'request.item.username',
          value: `@${username}`,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.authorized_key',
          value: FormatUtils.shortenString(authorizedKey, 6),
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

export default AddKeyAuthority;
