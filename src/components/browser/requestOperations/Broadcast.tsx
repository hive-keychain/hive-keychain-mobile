import {Operation} from '@hiveio/dhive';
import {Account, KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import React from 'react';
import {broadcast} from 'utils/hive';
import {getAccountKeys} from 'utils/hiveUtils';
import {
  RequestBroadcast,
  RequestError,
  RequestId,
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
  request: RequestBroadcast & RequestId & UsingHAS;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, has, ...data} = request;
  const {username, method, operations} = data;
  return (
    <RequestOperation
      has={has}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.broadcast')}
      beautifyError
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={() => {
        return performBroadcastOperation(accounts, request);
      }}>
      <RequestItem
        content={`@${username}`}
        title={translate('request.item.username')}
      />
      <RequestItem content={method} title={translate('request.item.method')} />
      <CollapsibleData
        content={JSON.stringify(operations, undefined, 2)}
        title={translate('request.item.data')}
        hidden={translate('request.item.hidden_data')}
      />
    </RequestOperation>
  );
};

const performBroadcastOperation = async (
  accounts: Account[],
  request: RequestBroadcast & RequestId,
) => {
  const {username, method, operations} = request;
  const account = accounts.find((e) => e.name === request.username);
  const key = account.keys[method.toLowerCase() as KeyTypes];
  let ops = operations;
  if (typeof operations === 'string') {
    ops = JSON.parse(operations) as Operation[];
  }
  for (const op of ops as Operation[]) {
    const name = op[0];
    const data = op[1];
    switch (name) {
      case 'update_proposal_votes':
        if (!data.extensions) data.extensions = [];
      case 'custom_json':
        if (!data.required_auths) data.required_auths = [];
        break;
      case 'transfer':
        const memo = data.memo;
        if (memo && memo.length && memo[0] === '#') {
          const receiverMemoKey = (await getAccountKeys(data.to)).memo;
          if (!receiverMemoKey) {
            throw new Error('Failed to load receiver memo key');
          }
          const userMemo = accounts.find((e) => e.name === username).keys.memo;
          if (!userMemo) {
            throw new Error('You need a memo key to encrypt memos.');
          }
          data.memo = await encodeMemo(userMemo, receiverMemoKey, memo);
        }
        break;
      default:
        break;
    }
  }
  return await broadcast(key, operations as Operation[]);
};

export const broadcastWithoutConfirmation = (
  accounts: Account[],
  request: RequestBroadcast & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  processOperationWithoutConfirmation(
    async () => await performBroadcastOperation(accounts, request),
    request,
    sendResponse,
    sendError,
    true,
    translate('request.success.broadcast'),
  );
};
