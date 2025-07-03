import {Account, KeyTypes} from 'actions/interfaces';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {post} from 'utils/hive';
import {
  RequestError,
  RequestId,
  RequestPost,
  RequestSuccess,
  UsingHAS,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import CollapsibleData from './components/CollapsibleData';
import RequestItem from './components/RequestItem';
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
      }}>
      <UsernameWithAvatar
        username={username}
        title={translate('request.item.username')}
        avatarPosition="left"
      />
      {title ? (
        <RequestItem title={translate('request.item.title')} content={title} />
      ) : null}
      <RequestItem
        title={translate('request.item.permlink')}
        content={permlink}
      />
      <CollapsibleData
        title={translate('request.item.body')}
        hidden={translate('request.item.hidden_data')}
        content={body}
      />
      {parent_username ? (
        <UsernameWithAvatar
          username={parent_username}
          title={translate('request.item.parent_username')}
        />
      ) : null}
      <RequestItem
        content={parent_perm}
        title={translate('request.item.parent_perm')}
      />
      <CollapsibleData
        content={JSON.stringify(JSON.parse(json_metadata), undefined, 2)}
        title={translate('request.item.json_metadata')}
        hidden={translate('request.item.hidden_data')}
      />
      {comment_options ? (
        <CollapsibleData
          content={JSON.stringify(comment_options, undefined, 2)}
          title={translate('request.item.comment_options')}
          hidden={translate('request.item.hidden_data')}
        />
      ) : null}
    </RequestOperation>
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
