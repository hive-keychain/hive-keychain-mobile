import {KeyTypes} from 'actions/interfaces';
import {FormatUtils} from 'hive-keychain-commons';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {createClaimedAccount} from 'utils/hive';
import {RequestCreateClaimedAccount, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
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

  const performOperation = async (options: TransactionOptions) => {
    const account = accounts.find((e) => e.name === request.username);
    const key = account.keys.active;
    return await createClaimedAccount(
      key,
      {
        creator: username,
        new_account_name: new_account,
        owner: JSON.parse(owner),
        active: JSON.parse(active),
        posting: JSON.parse(posting),
        json_metadata: '{}',
        memo_key: memo,
        extensions: [],
      },
      options,
    );
  };

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
      performOperation={performOperation}
      confirmationData={[
        {
          title: 'request.item.creator',
          value: username,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.new_account',
          value: `@${new_account}`,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.owner',
          value: JSON.stringify(JSON.parse(owner), null, 2),
          hidden: translate('request.item.hidden_data'),
          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
        {
          title: 'request.item.active',
          value: JSON.stringify(JSON.parse(active), null, 2),
          hidden: translate('request.item.hidden_data'),
          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
        {
          title: 'request.item.posting',
          value: JSON.stringify(JSON.parse(posting), null, 2),
          hidden: translate('request.item.hidden_data'),
          tag: ConfirmationDataTag.COLLAPSIBLE,
        },
        {
          title: 'request.item.memo_key',
          value: FormatUtils.shortenString(memo, 6),
        },
      ]}
    />
  );
};

export default CreateAccount;
