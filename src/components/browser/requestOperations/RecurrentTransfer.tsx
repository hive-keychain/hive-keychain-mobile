import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {recurrentTransfer} from 'utils/hive';
import {getAccountKeys} from 'utils/hiveUtils';
import {RequestId, RequestRecurrentTransfer} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';
import RequestBalance from './components/RequestBalance';

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
  const {amount, to, currency, executions, recurrence, memo} = data;

  const {
    getAccountKey,
    RequestUsername,
    getAccountMemoKey,
    getUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      selectedUsername={getUsername()}
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
        let finalMemo = memo;
        if (memo[0] === '#') {
          if (!getAccountMemoKey())
            throw new Error(translate('request.error.transfer.encrypt'));
          const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
          finalMemo = await encodeMemo(
            getAccountMemoKey(),
            receiverMemoKey,
            memo,
          );
        }
        return await recurrentTransfer(
          getAccountKey(),
          {
            amount: `${amount} ${currency}`,
            memo: finalMemo,
            to,
            from: getUsername(),
            recurrence,
            executions,
            extensions: [],
          },
          options,
        );
      }}>
      <RequestUsername />
      <UsernameWithAvatar
        title={translate('request.item.to')}
        username={to}
        avatarPosition="left"
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
      <RequestBalance
        username={getUsername()}
        startToken={currency}
        amount={parseFloat(amount) * executions}
        accounts={accounts as ActiveAccount[]}
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
