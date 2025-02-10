import {KeyTypes} from 'actions/interfaces';
import {RequestDeposit, RequestId} from 'hive-keychain-commons';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {VscConfig} from 'utils/config';
import {transfer} from 'utils/hive';
import {translate} from 'utils/localize';
import RequestItem from '../components/RequestItem';
import RequestOperation from '../components/RequestOperation';
import {RequestComponentCommonProps} from '../requestOperations.types';

type Props = {
  request: RequestDeposit & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, address, amount, currency} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      message={translate(`request.message.vscDeposit`, {
        token: currency,
      })}
      successMessage={''}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);

        return await transfer(
          account.keys[KeyTypes.active],
          {
            from: username!,
            to: VscConfig.ACCOUNT,
            memo: `to=${address}`,
            amount: `${amount} ${currency}`,
          },
          options,
        );
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.to')}
        content={`@${VscConfig.ACCOUNT}`}
      />
      <RequestItem
        title={translate('request.item.evm_address')}
        content={address}
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${currency}`}
      />
    </RequestOperation>
  );
};
