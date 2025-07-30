import {KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import {ConfirmationDataTag} from 'components/operations/Confirmation';
import {createBalanceData} from 'components/operations/ConfirmationCard';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React, {useEffect, useState} from 'react';
import SimpleToast from 'react-native-simple-toast';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {beautifyTransferError} from 'utils/format';
import {transfer} from 'utils/hive';
import {getAccount, getAccountKeys} from 'utils/hiveUtils';
import {RequestId, RequestTransfer} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestTransfer & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {to, memo, amount, currency} = data;
  const [availableBalance, setAvailableBalance] = useState(0);
  const {
    getUsername,
    getAccountKey,
    getAccountMemoKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);
  useEffect(() => {
    const fetchAvailableBalance = async () => {
      const account = await getAccount(getUsername());
      setAvailableBalance(
        currency === 'HIVE'
          ? parseFloat(account.balance.toString())
          : parseFloat(account.hbd_balance.toString()),
      );
    };
    fetchAvailableBalance();
  }, [getUsername(), currency]);
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.transfer', {
        amount,
        currency,
        username: getUsername(),
        to,
      })}
      errorMessage={(error, data) =>
        beautifyTransferError(error, {...data, username: getUsername()})
      }
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      RequestUsername={RequestUsername}
      performOperation={async (options: TransactionOptions) => {
        let finalMemo = memo;
        if (memo.length && memo[0] === '#') {
          const memoKey = getAccountMemoKey();
          if (!memoKey) {
            SimpleToast.show(translate('request.error.transfer.encrypt'));
            return;
          }
          const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
          finalMemo = await encodeMemo(memoKey, receiverMemoKey, memo);
        }
        return await transfer(
          getAccountKey(),
          {
            from: getUsername(),
            to,
            memo: finalMemo,
            amount: `${amount} ${currency}`,
          },
          options,
        );
      }}
      confirmationData={[
        {
          title: 'request.item.username',
          value: '',
          tag: ConfirmationDataTag.REQUEST_USERNAME,
        },
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
      ]}
    />
  );
};
