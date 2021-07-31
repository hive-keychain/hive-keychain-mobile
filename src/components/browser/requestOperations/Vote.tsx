import {Account, KeyTypes} from 'actions/interfaces';
import React from 'react';
import {vote} from 'utils/hive';
import {
  RequestError,
  RequestId,
  RequestSuccess,
  RequestVote,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestVote & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, author, permlink, weight} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.vote', {
        author,
        permlink,
        weight: +weight / 100,
      })}
      beautifyError
      method={KeyTypes.posting}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={() => {
        return performVoteOperation(accounts, request);
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
      <RequestItem
        title={translate('request.item.weight')}
        content={`${(+weight / 100).toFixed(2)}%`}
      />
    </RequestOperation>
  );
};

const performVoteOperation = async (
  accounts: Account[],
  request: RequestVote & RequestId,
) => {
  const {username, author, permlink, weight} = request;
  const account = accounts.find((e) => e.name === request.username);
  const key = account.keys.posting;
  return await vote(key, {
    voter: username,
    author,
    permlink,
    weight: +weight,
  });
};

export const voteWithoutConfirmation = (
  accounts: Account[],
  request: RequestVote & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
) => {
  processOperationWithoutConfirmation(
    async () => await performVoteOperation(accounts, request),
    request,
    sendResponse,
    sendError,
    true,
    translate('request.success.vote'),
  );
};
