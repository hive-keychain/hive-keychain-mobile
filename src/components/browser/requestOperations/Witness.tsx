import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {voteForWitness} from 'utils/hive';
import {RequestId, RequestWitnessVote} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestWitnessVote & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
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
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      performOperation={async (options: TransactionOptions) => {
        return await voteForWitness(
          getAccountKey(),
          {
            account: getUsername(),
            witness,
            approve: vote,
          },
          options,
        );
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
