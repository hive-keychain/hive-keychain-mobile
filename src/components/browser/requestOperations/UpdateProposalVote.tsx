import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {updateProposalVote} from 'utils/hive';
import {RequestId, RequestUpdateProposalVote} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestUpdateProposalVote & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, proposal_ids, approve, extensions} = data;
  const ids = `#${JSON.parse(proposal_ids).join(', #')}`;
  console.log(extensions, username, proposal_ids, approve);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(
        `request.success.${approve ? 'a' : 'unA'}pproveProposal`,
        {ids},
      )}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await updateProposalVote(key, {
          extensions:
            typeof extensions === 'string'
              ? JSON.parse(extensions)
              : extensions,
          voter: username,
          proposal_ids: JSON.parse(proposal_ids),
          approve,
        });
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.ids')} content={ids} />
      <RequestItem
        title={translate('request.item.action')}
        content={translate(`common.${approve ? '' : 'un'}vote`)}
      />
    </RequestOperation>
  );
};
