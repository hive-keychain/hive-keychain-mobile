import {KeyTypes} from 'actions/interfaces';
import {RequestId, RequestUpdateProposalVote} from 'hive-keychain-commons';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {updateProposalVote} from 'utils/hive';
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
  const ids = `#${JSON.parse(proposal_ids + '').join(', #')}`;

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
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await updateProposalVote(
          key,
          {
            extensions:
              typeof extensions === 'string'
                ? JSON.parse(extensions)
                : extensions,
            voter: username,
            proposal_ids: JSON.parse(proposal_ids + ''),
            approve,
          },
          options,
        );
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
