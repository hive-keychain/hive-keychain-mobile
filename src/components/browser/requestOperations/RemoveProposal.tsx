import {KeyTypes} from 'actions/interfaces';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {removeProposal} from 'utils/hive';
import {RequestId, RequestRemoveProposal} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestRemoveProposal & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, proposal_ids, extensions} = data;
  const ids = `#${JSON.parse(proposal_ids).join(', #')}`;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.removeProposal`, {ids})}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await removeProposal(
          key,
          {
            proposal_owner: username,
            proposal_ids: JSON.parse(proposal_ids),
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
      <RequestItem title={translate('request.item.ids')} content={ids} />
    </RequestOperation>
  );
};
