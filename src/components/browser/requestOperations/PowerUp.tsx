import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {powerUp} from 'utils/hive';
import {RequestId, RequestPowerUp} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestPowerUp & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, recipient: to, steem: hive} = data;
  const performOperation = async (options: TransactionOptions) => {
    const account = accounts.find((e) => e.name === request.username);
    const key = account.keys.active;
    return await powerUp(
      key,
      {
        from: username,
        to,
        amount: `${hive} HIVE`,
      },
      options,
    );
  };
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.power_up', {
        hive,
        to,
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={performOperation}
      confirmationData={[
        {
          title: 'request.item.username',
          value: username,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.to',
          value: to,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.amount',
          value: hive,
          currency: 'HIVE',
          tag: ConfirmationDataTag.AMOUNT,
        },
      ]}
    />
  );
};
