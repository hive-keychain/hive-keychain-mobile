import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {voteForWitness} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {witness, vote} = data;
  const {
    getAccountKey,
    RequestUsername,
    getUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(
        `request.success.${vote ? 'witness_vote' : 'witness_unvote'}`,
        {witness},
      )}
      beautifyError
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return await voteForWitness(getAccountKey(), {
          account: getUsername(),
          witness,
          approve: vote,
        });
      }}>
      <RequestUsername />
      <RequestItem
        title={translate('request.item.witness')}
        content={`@${witness}`}
      />
      <RequestItem
        title={translate('request.item.action')}
        content={translate(`common.${vote ? 'vote' : 'unvote'}`)}
      />
    </RequestOperation>
  );
};
