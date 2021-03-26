import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {vote} from 'utils/hive';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {username, author, permlink, weight} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.vote', {
        author,
        permlink,
        weight,
      })}
      beautifyError
      method={'posting'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.posting;
        return await vote(key, {
          voter: username,
          author: 'hi',
          permlink,
          weight: parseInt(weight, 10),
        });
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.author')}
        content={`@${author}`}
      />
      <RequestItem
        title={translate('request.item.permlink')}
        content={permlink}
      />
      <RequestItem title={translate('request.item.weight')} content={weight} />
    </RequestOperation>
  );
};
