import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
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
  const {proposal_ids, approve, extensions} = data;
  const ids = `#${JSON.parse(proposal_ids).join(', #')}`;

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
        `request.success.${approve ? 'a' : 'unA'}pproveProposal`,
        {ids},
      )}
      beautifyError
      selectedUsername={getUsername()}
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        return await updateProposalVote(
          getAccountKey(),
          {
            extensions:
              typeof extensions === 'string'
                ? JSON.parse(extensions)
                : extensions,
            voter: getUsername(),
            proposal_ids: JSON.parse(proposal_ids),
            approve,
          },
          options,
        );
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.ids')} content={ids} />
      <RequestItem
        title={translate('request.item.action')}
        content={translate(`common.${approve ? '' : 'un'}vote`)}
      />
    </RequestOperation>
  );
};
