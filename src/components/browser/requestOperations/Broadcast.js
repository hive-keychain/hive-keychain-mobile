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
        for (const [name, data] of operations) {
          switch (name) {
            case 'custom_json':
              data.required_auths = [];
              break;
            case 'transfer':
              const memo = data.memo;
              if (memo && memo.length > 0 && memo[0] === '#') {
                const receiverMemoKey = (await getAccountKeys(data.to)).memo;
                if (!receiverMemoKey) {
                  throw new Error('Failed to load receiver memo key');
                }
                const memoReceiver = receiverMemoKey[0].memo_key;
                data.memo = encodeMemo(
                  accounts.find((e) => e.name === username).memo,
                  memoReceiver,
                  memo,
                );
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
