import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {RequestId, RequestWitnessVote} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {voteForWitness} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
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
  const {getAccountKey, RequestUsername, getUsername} =
    usePotentiallyAnonymousRequest(request, accounts);
  const performOperation = async (options: TransactionOptions) => {
    return await voteForWitness(
      getAccountKey(),
      {
        account: getUsername(),
        witness,
        approve: vote,
      },
      options,
    );
  };
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
      RequestUsername={RequestUsername}
      performOperation={performOperation}
      confirmationData={[
        {tag: ConfirmationDataTag.REQUEST_USERNAME, title: '', value: ''},
        {
          title: 'request.item.witness',
          value: witness,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.action',
          value: translate(`common.${vote ? 'vote' : 'unvote'}`),
        },
      ]}
    />
  );
};
