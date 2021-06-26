import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {post} from 'utils/hive';
import {RequestId, RequestPost} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import CollapsibleData from './components/CollapsibleData';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestPost & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
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
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.post')}
      beautifyError
      method={KeyTypes.posting}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.posting;
        return await post(key, data);
      }}>
      <RequestItem
        content={`@${username}`}
        title={translate('request.item.username')}
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
        <RequestItem
          content={`@${parent_username}`}
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
