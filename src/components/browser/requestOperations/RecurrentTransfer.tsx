import {KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import {RequestId, RequestRecurrentTransfer} from 'hive-keychain-commons';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {recurrentTransfer} from 'utils/hive';
import {getAccountKeys} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestRecurrentTransfer & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, amount, to, currency, executions, recurrence, memo} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.recurrentTransfer`, {
        amount,
        currency,
        to,
        executions,
        recurrence,
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        let finalMemo = memo;
        if (memo[0] === '#') {
          if (!account.keys.memo)
            throw new Error(translate('request.error.transfer.encrypt'));
          const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
          finalMemo = await encodeMemo(
            account.keys.memo,
            receiverMemoKey,
            memo,
          );
        }
        return await recurrentTransfer(
          key,
          {
            amount: `${amount} ${currency}`,
            memo: finalMemo,
            to,
            from: username,
            recurrence,
            executions,
            extensions: [],
          },
          options,
        );
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
      <RequestItem
        title={translate('request.item.memo')}
        content={
          memo.length
            ? memo[0] === '#'
              ? `${memo.substring(1)} (${translate('common.encrypted')})`
              : memo
            : translate('common.none')
        }
      />
      <RequestItem
        title={translate('request.item.recurrence')}
        content={translate(
          'wallet.operations.transfer.confirm.recurrenceData',
          {exec: executions, recurrence},
        )}
      />
    </RequestOperation>
  );
};
