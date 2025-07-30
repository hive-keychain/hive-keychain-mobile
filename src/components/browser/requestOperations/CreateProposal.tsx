import {KeyTypes} from 'actions/interfaces';
import {ConfirmationDataTag} from 'components/operations/Confirmation';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {createProposal} from 'utils/hive';
import {RequestCreateProposal, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestCreateProposal & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {
    username,
    permlink,
    receiver,
    subject,
    start,
    end,
    daily_pay,
    extensions,
  } = data;
  const performOperation = async (options: TransactionOptions) => {
    const account = accounts.find((e) => e.name === request.username);
    const key = account.keys.active;
    return await createProposal(
      key,
      {
        creator: username,
        receiver,
        start_date: start,
        end_date: end,
        daily_pay,
        subject,
        permlink,
        extensions: JSON.parse(extensions),
      },
      options,
    );
  };

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.createProposal`)}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={performOperation}
      confirmationData={[
        {
          title: 'request.item.username',
          value: username,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.receiver',
          value: receiver,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.title',
          value: subject,
        },
        {
          title: 'request.item.permlink',
          value: permlink,
        },
        {
          title: 'request.item.duration',
          value: `${start.split('T')[0]} - ${end.split('T')[0]} (${
            (new Date(end).getTime() - new Date(start).getTime()) /
            (24 * 60 * 60 * 1000)
          } days)`,
        },
        {
          title: 'request.item.daily_pay',
          value: daily_pay.split(' ')[0],
          tag: ConfirmationDataTag.AMOUNT,
          currency: 'HBD',
        },
      ]}
    />
  );
};
