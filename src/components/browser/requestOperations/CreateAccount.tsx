import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {createClaimedAccount} from 'utils/hive';
import {RequestCreateClaimedAccount, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestCreateClaimedAccount & RequestId;
} & RequestComponentCommonProps;

const CreateAccount = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, new_account, owner, posting, active, memo} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.createClaimedAccount', {
        new_account,
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        await createClaimedAccount(key, {
          creator: username,
          new_account_name: new_account,
          owner: JSON.parse(owner),
          active: JSON.parse(active),
          posting: JSON.parse(posting),
          json_metadata: '{}',
          memo_key: memo,
          extensions: [],
        });
      }}>
      <RequestItem
        content={`@${username}`}
        title={translate('request.item.creator')}
      />
      <RequestItem
        title={translate('request.item.new_account')}
        content={`@${new_account}`}
      />
      <RequestItem
        title={translate('request.item.owner')}
        content={JSON.stringify(JSON.parse(owner), null, 2)}
      />
      <RequestItem
        title={translate('request.item.active')}
        content={JSON.stringify(JSON.parse(active), null, 2)}
      />
      <RequestItem
        title={translate('request.item.posting')}
        content={JSON.stringify(JSON.parse(posting), null, 2)}
      />
      <RequestItem title={translate('request.item.memo_key')} content={memo} />
    </RequestOperation>
  );
};

export default CreateAccount;
