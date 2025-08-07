import {KeyTypes} from 'actions/interfaces';
import {encodeMemo} from 'components/bridge';
import {createBalanceData} from 'components/operations/ConfirmationCard';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React, {useEffect, useState} from 'react';
import SimpleToast from 'react-native-simple-toast';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {sendToken} from 'utils/hive';
import {getAccountKeys} from 'utils/hiveUtils';
import {RequestId, RequestSendToken} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {getUserBalance} from 'utils/tokens.utils';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSendToken & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, amount, to, currency, memo} = data;
  const [availableBalance, setAvailableBalance] = useState(0);
  const {
    getUsername,
    getAccountKey,
    getAccountMemoKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);
  useEffect(() => {
    const fetchAvailableBalance = async () => {
      const account = await getUserBalance(getUsername());
      setAvailableBalance(
        +account.find((token) => token.symbol === currency)?.balance || 0,
      );
    };
    fetchAvailableBalance();
  }, [getUsername()]);
  const performOperation = async (options: TransactionOptions) => {
    let finalMemo = memo;
    if (memo.length && memo[0] === '#') {
      if (!getAccountMemoKey()) {
        SimpleToast.show(translate('request.error.transfer.encrypt'));
        return;
      }
      const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
      finalMemo = await encodeMemo(getAccountMemoKey(), receiverMemoKey, memo);
    }
    return await sendToken(
      getAccountKey(),
      getUsername(),
      {
        symbol: currency,
        to: to,
        quantity: amount,
        memo: finalMemo,
      },
      options,
    );
  };
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.sendToken')}
      errorMessage={translate('request.error.broadcast')}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      RequestUsername={RequestUsername}
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
        createBalanceData(
          'wallet.operations.transfer.confirm.balance',
          availableBalance,
          parseFloat(amount),
          currency,
        ),
        {
          title: 'request.item.memo',
          value: memo.length
            ? memo[0] === '#'
              ? `${memo.substring(1)} (${translate('common.encrypted')})`
              : memo
            : translate('common.none'),
        },
      ]}
    />
  );
};
