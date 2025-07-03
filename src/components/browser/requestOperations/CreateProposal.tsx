import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {createProposal} from 'utils/hive';
import {RequestCreateProposal, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';

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

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.createProposal`)}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
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
      }}>
      <UsernameWithAvatar
        title={translate('request.item.username')}
        username={username}
        avatarPosition="left"
      />
      <UsernameWithAvatar
        title={translate('request.item.receiver')}
        username={receiver}
      />
      <RequestItem title={translate('request.item.title')} content={subject} />
      <RequestItem
        title={translate('request.item.permlink')}
        content={permlink}
      />
      <RequestItem
        title={translate('request.item.duration')}
        content={`${start.split('T')[0]} - ${end.split('T')[0]} (${
          (new Date(end).getTime() - new Date(start).getTime()) /
          (24 * 60 * 60 * 1000)
        } days)`}
      />
      <RequestItem
        title={translate('request.item.daily_pay')}
        content={daily_pay}
      />
    </RequestOperation>
  );
};
