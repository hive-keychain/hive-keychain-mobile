import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {updateProposalVote} from 'utils/hive';
import {RequestId, RequestUpdateProposalVote} from 'utils/keychain.types';
import {translate} from 'utils/localize';
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
  const {proposal_ids, approve, extensions} = data;
  const ids = `#${JSON.parse(proposal_ids).join(', #')}`;

  const {
    getAccountKey,
    RequestUsername,
    getUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);
  const performOperation = async (options: TransactionOptions) => {
    return await updateProposalVote(
      getAccountKey(),
      {
        extensions:
          typeof extensions === 'string' ? JSON.parse(extensions) : extensions,
        voter: getUsername(),
        proposal_ids: JSON.parse(proposal_ids),
        approve,
      },
      options,
    );
  };
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(
        `request.success.${approve ? 'a' : 'unA'}pproveProposal`,
        {ids},
      )}
      beautifyError
      selectedUsername={getUsername()}
      RequestUsername={RequestUsername}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={performOperation}
      confirmationData={[
        {tag: ConfirmationDataTag.REQUEST_USERNAME, title: '', value: ''},
        {
          title: 'request.item.ids',
          value: ids,
        },
        {
          title: 'request.item.action',
          value: translate(`common.${approve ? '' : 'un'}vote`),
        },
      ]}
    />
  );
};
