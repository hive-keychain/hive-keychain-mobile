import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {RequestId, RequestSavings} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {beautifyTransferError} from 'utils/format.utils';
import {depositToSavings, withdrawFromSavings} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSavings & RequestId;
} & RequestComponentCommonProps;

const Savings = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {to, amount, currency, operation} = request;
  const memo = request.memo || '';
  const isDeposit = operation === 'deposit';
  const {getUsername, getAccountKey, RequestUsername} =
    usePotentiallyAnonymousRequest(request, accounts);

  const successMessage = translate(
    isDeposit
      ? 'toast.savings_deposit_success'
      : 'toast.savings_withdraw_success',
    {amount: `${amount} ${currency}`},
  );

  const performOperation = async (options: TransactionOptions) => {
    const op = {
      from: getUsername(),
      to,
      amount: `${amount} ${currency}`,
      memo,
      request_id: Date.now(),
    };
    return isDeposit
      ? await depositToSavings(getAccountKey(), op, options)
      : await withdrawFromSavings(getAccountKey(), op, options);
  };

  const memoLabel = memo.startsWith('#')
    ? `${memo.substring(1)} (${translate('common.encrypted')})`
    : memo;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={successMessage}
      errorMessage={(error, _data) =>
        beautifyTransferError(error, {
          currency,
          username: getUsername(),
          to,
        })
      }
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      RequestUsername={RequestUsername}
      performOperation={performOperation}
      confirmationData={[
        {
          title: '',
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
        ...(memo.length
          ? [
              {
                title: 'request.item.memo',
                value: memoLabel,
              },
            ]
          : []),
      ]}
    />
  );
};

export default Savings;
