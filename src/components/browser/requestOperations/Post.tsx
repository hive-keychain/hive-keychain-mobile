import {Account, KeyTypes} from 'actions/interfaces';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {
  RequestError,
  RequestId,
  RequestPost,
  RequestSuccess,
  UsingHAS,
} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {post} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestPost & RequestId & UsingHAS;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, has, ...data} = request;
  const {
    username,
    title,
    body,
    permlink,
    parent_username,
    parent_perm,
    json_metadata,
    comment_options,
  } = data;
  return (
    <RequestOperation
      has={has}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.post')}
      beautifyError
      method={KeyTypes.posting}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={(options: TransactionOptions) => {
        return performPostOperation(accounts, request, options);
      }}
      confirmationData={[
        {
          title: 'request.item.username',
          value: username,
          tag: ConfirmationDataTag.USERNAME,
        },
        title && {
          title: 'request.item.title',
          value: title,
        },
        {
          title: 'request.item.permlink',
          value: permlink,
        },
        {
          title: 'request.item.body',
          value: body,
          hidden: translate('request.item.hidden_data'),

          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
        parent_username && {
          title: 'request.item.parent_username',
          value: parent_username,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.parent_perm',
          value: parent_perm,
        },
        {
          title: 'request.item.json_metadata',
          value: JSON.stringify(JSON.parse(json_metadata), undefined, 2),
          hidden: translate('request.item.hidden_data'),

          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
        comment_options && {
          title: 'request.item.comment_options',
          value: JSON.stringify(JSON.parse(comment_options), undefined, 2),
          hidden: translate('request.item.hidden_data'),

          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
      ].filter(Boolean)}
    />
  );
};

const performPostOperation = async (
  accounts: Account[],
  request: RequestPost & RequestId,
  options?: TransactionOptions,
) => {
  const {request_id, ...data} = request;

  const account = accounts.find((e) => e.name === request.username);
  const key = account.keys.posting;
  return await post(key, data, options);
};

export const postWithoutConfirmation = (
  accounts: Account[],
  request: RequestPost & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
  options?: TransactionOptions,
) => {
  processOperationWithoutConfirmation(
    async () => await performPostOperation(accounts, request, options),
    request,
    sendResponse,
    sendError,
    true,
    translate('request.success.post'),
  );
};
