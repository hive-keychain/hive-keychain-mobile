import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {broadcast} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import CollapsibleData from './components/CollapsibleData';
import {encodeMemo} from 'components/bridge';
import {getAccountKeys} from 'utils/hiveUtils';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {username, method, operations} = data;
  console.log(data);
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.broadcast')}
      beautifyError
      method={method.toLowerCase()}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys[method.toLowerCase()];
        let ops = operations;
        if (typeof operations === 'string') {
          ops = JSON.parse(operations);
        }
        console.log(ops);
        for (const [name, data] of ops) {
          console.log(name, data);
          switch (name) {
            case 'custom_json':
              data.required_auths = [];
              break;
            case 'transfer':
              const memo = data.memo;
              if (memo && memo.length && memo[0] === '#') {
                const receiverMemoKey = (await getAccountKeys(data.to)).memo;
                if (!receiverMemoKey) {
                  throw new Error('Failed to load receiver memo key');
                }
                const userMemo = accounts.find((e) => e.name === username).keys
                  .memo;
                if (!userMemo) {
                  throw new Error('You need a memo key to encrypt memos.');
                }
                data.memo = await encodeMemo(userMemo, receiverMemoKey, memo);
              }
              break;
          }
        }
        return await broadcast(key, operations);
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
