import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {updateProposalVote} from 'utils/hive';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
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
      method={'active'}
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
