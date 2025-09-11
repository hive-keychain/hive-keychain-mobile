import {KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import {createBalanceData} from 'components/operations/ConfirmationCard';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React, {useEffect, useState} from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {
  RequestId,
  RequestRecurrentTransfer,
} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getAccount, getAccountKeys} from 'utils/hive.utils';
import {recurrentTransfer} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
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
  const {amount, to, currency, executions, recurrence, memo} = data;
  const [availableBalance, setAvailableBalance] = useState(0);
  const {getAccountKey, RequestUsername, getAccountMemoKey, getUsername} =
    usePotentiallyAnonymousRequest(request, accounts);
  useEffect(() => {
    const fetchAvailableBalance = async () => {
      const account = await getAccount(getUsername());
      setAvailableBalance(
        currency === 'HIVE'
          ? parseFloat(account.balance.toString())
          : parseFloat(account.hbd_balance.toString()) / 1000,
      );
    };
    fetchAvailableBalance();
  }, [getUsername(), currency]);
  const performOperation = async (options: TransactionOptions) => {
    let finalMemo = memo;
    if (memo[0] === '#') {
      if (!getAccountMemoKey())
        throw new Error(translate('request.error.transfer.encrypt'));
      const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
      finalMemo = await encodeMemo(getAccountMemoKey(), receiverMemoKey, memo);
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
  };
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      selectedUsername={getUsername()}
      RequestUsername={RequestUsername}
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
      performOperation={performOperation}
      confirmationData={[
        {tag: ConfirmationDataTag.REQUEST_USERNAME, title: '', value: ''},
        {
          title: 'request.item.to',
          value: to,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.amount',
          value: amount,
          currency,
          tag: ConfirmationDataTag.AMOUNT,
        },
        {
          title: 'request.item.memo',
          value: memo.length
            ? memo[0] === '#'
              ? `${memo.substring(1)} (${translate('common.encrypted')})`
              : memo
            : translate('common.none'),
        },
        createBalanceData(
          'wallet.operations.transfer.confirm.balance',
          availableBalance,
          parseFloat(amount),
          currency,
        ),
        {
          title: 'request.item.recurrence',
          value: translate(
            'wallet.operations.transfer.confirm.recurrenceData',
            {exec: executions, recurrence},
          ),
        },
      ]}
    />
  );
};
